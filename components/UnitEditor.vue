<template>
  <div v-if="visible" id="uniteditor" class="xc-root">
    <div class="xc-barrier"></div>
    <div class="xc-container" @click.stop="onClickOutside">
      <div class="xc-NodeBox" @click.stop>
        <div class="xc-NodeBox_Head border-b">
          <div class="flex items-center justify-between">
            <div class="xc-NodeBox_Title">
              <input
                :value="title"
                class="xc-NodeBox_TitleInput"
                type="text"
                @keydown.enter.prevent="onSubmitTitle($event)"
              />
            </div>
            <div class="px-2 text-sm whitespace-nowrap">
              <span>{{ rate }}</span>
              <span class="text-xs">%</span>
            </div>
            <button class="xc-NodeBox_Delete" @click="onDeleteUnit">
              削除
            </button>
          </div>
        </div>
        <div class="xc-NodeBox_Body px-2 py-2">
          <ul class="list-inside pl-2 text-sm">
            <li v-for="(soc, idx) of sockets" :key="idx">
              <div class="flex justify-between items-center">
                <div
                  :data-socketid="soc.id"
                  class="label whitespace-nowrap"
                  style="min-width: 100px"
                >
                  <template v-if="soc.type === 'fact'">
                    <input
                      :value="soc.title"
                      class="xc-NodeBox_SocketFact"
                      type="text"
                      @keydown.enter.prevent="onSubmitSocket($event, soc.id)"
                    />
                  </template>
                  <template v-else>
                    <span class="xc-NodeBox_SocketAlias">{{ soc.title }}</span>
                  </template>
                </div>
                <div class="done">{{ soc.done ? '✅' : '⬜' }}</div>
                <button class="xc-NodeBox_Delete" @click="onDeleteSocket(idx)">
                  削除
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    visible: false,
    unitId: null,
    unit: {
      title: null,
      drawSockets: [],
      rate: null,
    },
    editing: false,
  }),

  computed: {
    title() {
      return this.unit.title
    },
    sockets() {
      return this.unit.drawSockets
    },
    rate() {
      return Math.floor(`${this.unit.rate * 100}`)
    },
  },

  methods: {
    async open(unitId) {
      this.visible = true
      this.unitId = unitId
      const unit = await this.$store.dispatch('quest/getUnit', unitId)
      const { title, drawSockets, rate } = unit
      this.unit = { title, drawSockets, rate }
    },
    onFocus() {
      this.editing = true
    },
    async onSubmitTitle($event, socketId) {
      const questId = this.unitId
      const title = $event.target.value
      const payload = { questId, title }
      await this.$store.dispatch('quest/updateTitle', payload)
    },
    async onSubmitSocket($event, socketId) {
      const questId = this.unitId
      const title = $event.target.value
      const payload = { questId, socketId, title }
      await this.$store.dispatch('quest/updateSocket', payload)
    },
    async onDeleteUnit() {
      if (this.sockets.length > 0) {
        alert('削除するには、すべての接続を解除してください。')
        return
      }
      const payload = { questId: this.unitId }
      const ok = await this.$store.dispatch('quest/deleteUnit', payload)
      if (ok) {
        this.close()
      }
    },
    async onDeleteSocket(socketIndex) {
      const questId = this.unitId
      const payload = { questId, socketIndex }
      await this.$store.dispatch('quest/detachSocket', payload)
      await this.open(this.unitId)
    },
    onClickOutside() {
      if (this.editing) {
        this.editing = false
      } else {
        this.close()
      }
    },
    onEscape() {
      if (window.getSelection().toString() === '') {
        this.close()
      } else {
        window.getSelection().removeAllRanges()
      }
    },
    close() {
      this.visible = false
      this.unitId = null
      this.editing = false
    },
  },
}
</script>

<style lang="postcss" scoped>
.xc-root {
  @apply absolute w-full h-screen top-0 left-0;
}

.xc-barrier {
  @apply w-full h-screen bg-black opacity-20;
}

.xc-container {
  @apply absolute w-full h-screen top-0 left-0;
  @apply flex justify-center items-center;
}

.xc-NodeBox {
  @apply bg-white border;
}

.xc-NodeBox_Title {
  @apply px-2 py-1;
  @apply text-xl font-bold whitespace-nowrap;
}

.xc-NodeBox_TitleInput {
  @apply px-2 py-1;
  @apply bg-yellow-100 border rounded;
}

.xc-NodeBox_Body {
  li {
    @apply my-2;
  }
}

.xc-NodeBox_SocketFact {
  @apply px-2 py-1 mr-2;
  @apply bg-yellow-100 border rounded;
}

.xc-NodeBox_SocketAlias {
  @apply px-2 py-1 mr-2;
}

.xc-NodeBox_Delete {
  @apply px-2;
  @apply text-sm text-red-500;
}
</style>
