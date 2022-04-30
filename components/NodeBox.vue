<template>
  <div class="cc-QuestBox border">
    <div class="title border-b">
      <div class="flex items-center justify-between">
        <div class="px-2 py-1 font-bold">{{ title }}</div>
        <div class="px-2">{{ rate }}</div>
      </div>
    </div>
    <div class="body px-2 py-2">
      <ul class="list-inside pl-2 text-sm">
        <li v-for="(soc, idx) of sockets" :key="idx">
          <div class="flex justify-between">
            <div class="label">{{ soc.title }}</div>
            <div class="done">{{ soc.done ? '✅' : '〰' }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: { obj: { type: Object, required: true } },
  computed: {
    title() {
      return this.obj.title
    },
    sockets() {
      return this.obj.drawSockets
    },
    rate() {
      return `${this.obj.rate * 100} %`
    }
  },
}
</script>

<style scoped>
.cc-QuestBox {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
}
</style>
