<template>
  <div v-if="visible" id="socketeditor" class="xc-root">
    <div class="xc-barrier"></div>
    <div class="xc-container" @click.stop="onClickOutside">
      <input
        ref="inp"
        v-model="vSocketLabel"
        type="text"
        class="bg-white py-1 px-2 rounded"
        @click.stop
        @focus="onFocus"
        @keydown.enter.prevent="onSubmitSocketLabel"
      />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    visible: false,
    boxId: null,
    socketId: null,
    vSocketLabel: null,
    editing: false,
  }),

  updated() {
    if (this.visible && !this.editing) {
      this.$refs.inp.focus()
      this.$refs.inp.select()
    }
  },

  mounted() {
    window.addEventListener('keyup', (event) => {
      if (event.keyCode === 27) {
        this.onEscape()
      }
    })
  },

  methods: {
    open(boxId, socket) {
      this.visible = true
      this.boxId = boxId
      const { id, title } = socket
      this.socketId = id
      this.vSocketLabel = title
    },
    onFocus() {
      this.editing = true
    },
    async onSubmitSocketLabel($event) {
      const questId = this.boxId
      const socketId = this.socketId
      const title = this.vSocketLabel
      const payload = { questId, socketId, title }
      this.$refs.inp.disabled = true
      await this.$store.dispatch('quest/updateSocket', payload)
      this.close()
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
      this.boxId = null
      this.socketId = null
      this.vSocketLabel = null
      this.editing = false
    },
  },
}
</script>

<style scoped>
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
</style>
