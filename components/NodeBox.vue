<template>
  <div class="cc-NodeBox border" :data-boxid="id">
    <div class="title border-b cursor-all-scroll" @pointerdown="onClickTitle">
      <div class="flex items-center justify-between">
        <div class="px-2 py-1 font-bold whitespace-nowrap">{{ title }}</div>
        <div class="px-2 text-sm whitespace-nowrap">
          <span>{{ rate }}</span
          ><span class="text-xs">%</span>
        </div>
      </div>
    </div>
    <div class="body px-2 py-2">
      <ul class="list-inside pl-2 text-sm">
        <li v-for="(soc, idx) of sockets" :key="idx">
          <div class="flex justify-between">
            <div
              :data-socketid="soc.id"
              class="label whitespace-nowrap"
              style="min-width: 100px"
              @pointerdown="onClickSocket"
              @dblclick="onDblclick($event, soc)"
            >
              {{ soc.title }}
            </div>
            <div class="done">{{ soc.done ? '✅' : '⬜' }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: String, required: true },
    obj: { type: Object, required: true },
  },

  computed: {
    title() {
      return this.obj.title
    },
    sockets() {
      return this.obj.drawSockets
    },
    rate() {
      return Math.floor(`${this.obj.rate * 100}`)
    },
  },

  methods: {
    onClickTitle(event) {
      event.stopPropagation()
      const { offsetX, offsetY } = event
      const pt = { x: offsetX, y: offsetY }
      this.$emit('on-click-title', this.id, pt)
    },
    onClickSocket(event) {
      event.stopPropagation()
      this.$emit('on-click-socket')
    },
    onDblclick(event, soc) {
      event.stopPropagation()
      this.$emit('on-dblclick-socket', this.id, soc)
    },
  },
}
</script>

<style scoped>
.cc-NodeBox {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
}
</style>
