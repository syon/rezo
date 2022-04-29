<template>
  <div class="cc-QuestBox border">
    <div class="title border-b">
      <div class="flex items-center justify-between">
        <div class="px-2 py-1 font-bold">Title</div>
        <div class="px-2">100%</div>
      </div>
    </div>
    <div class="body px-2 py-2">
      <ul class="list-inside pl-2 text-sm">
        <li v-for="(req, idx) of obj.reqs" :key="idx">{{ req }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: { obj: { type: Object, required: true } },
}
</script>

<style scoped>
.cc-QuestBox {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
}
</style>
