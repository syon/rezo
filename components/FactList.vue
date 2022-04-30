<template>
  <div class="bg-white w-48 text-sm shadow">
    <div v-for="(fact, idx) of questFacts" :key="`${idx}-${fact.id}`">
      <hr v-if="idx > 0" />
      <div class="flex justify-between px-4 py-2">
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
}
</script>
