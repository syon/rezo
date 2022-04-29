<template>
  <main>
    <div id="canvas">
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <template v-for="(pSet, idx) of pairs">
          <auto-bezier-info :key="idx" :sp="pSet.sp" :ep="pSet.ep" />
        </template>
      </svg>
    </div>
  </main>
</template>

<script>
export default {
  name: 'Step2Page',
  computed: {
    pairs() {
      return [
        {
          sp: { x: 100, y: 200 },
          ep: { x: 600, y: 400 },
        },
        {
          sp: { x: 550, y: 80 },
          ep: { x: 150, y: 500 },
        },
        {
          sp: { x: 200, y: 50 },
          ep: { x: 700, y: 250 },
        },
      ]
    },
  },
}
</script>

<style>
body {
  background-color: #eeeff2;
}

#canvas {
  width: 800px;
  margin: 2rem auto;
}

svg {
  border: 1px solid #eee;
  box-shadow: 0 2px 12px 4px rgba(0, 0, 0, 0.01);
  margin: 0 auto;
  background-color: #fff;
}
</style>
