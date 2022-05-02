<template>
  <div id="factlist" class="bg-white w-48 text-sm shadow h-full">
    <div v-for="(fact, idx) of questFacts" :key="`${idx}-${fact.id}`">
      <hr v-if="idx > 0" />
      <div class="flex justify-between px-4 py-2" @click="handleClick(fact.id)">
        <div>{{ fact.title }}</div>
        <div>{{ fact.done ? '✅' : '⬜' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      questFacts: 'quest/questFacts',
    }),
  },
  methods: {
    async handleClick(boxId) {
      const payload = { boxId }
      await this.$store.dispatch('quest/updateFactStatus', payload)
    },
  },
}
</script>

<style scoped>
#factlist {
  position: absolute;
  height: calc(100vh - 32px);
  top: 16px;
  left: 16px;
  overflow: auto;
}
</style>
