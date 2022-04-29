<template>
  <g>
    <path class="connector" :d="connectorData" />
  </g>
</template>

<script>
export default {
  props: {
    sp: { type: Object, required: true },
    ep: { type: Object, required: true },
  },
  computed: {
    sh() {
      return { x: (this.sp.x + this.ep.x) / 2, y: this.sp.y }
    },
    eh() {
      return { x: (this.sp.x + this.ep.x) / 2, y: this.ep.y }
    },
    connectorData() {
      const { sp, sh, eh, ep } = this
      return `M${sp.x},${sp.y} C${sh.x},${sh.y} ${eh.x},${eh.y} ${ep.x},${ep.y}`
    },
  },
}
</script>

<style scoped>
.connector {
  fill: none;
  stroke: black;
  stroke-width: 3px;
}

.zz-point {
  fill: rgba(30, 144, 255, 0.2);
  stroke: dodgerblue;
  stroke-width: 1;
  cursor: pointer;
}

.zz-handle {
  fill: rgba(0, 0, 0, 0.2);
  stroke: silver;
  stroke-width: 1;
  cursor: pointer;
}

.zz-handleline {
  stroke: silver;
  stroke-width: 1;
}

text {
  user-select: none;
}
</style>
