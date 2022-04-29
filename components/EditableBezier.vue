<template>
  <g @mousemove="onMousemove" @pointerup="dragStop">
    <path class="connector" :d="connectorData" />
    <text x="10" y="20" font-size="12" font-family="monospace">
      &lt;path d="{{ connectorData }}"/&gt;
    </text>
    <g>
      <g>
        <rect
          :x="sp.x - 5"
          :y="sp.y - 5"
          width="10"
          height="10"
          class="zz-point"
          @pointerdown="dragStart('startPoint')"
        />
        <text :x="sp.x + 15" :y="sp.y + 15" font-size="12">
          x:{{ sp.x }} y:{{ sp.y }}
        </text>
      </g>
      <g>
        <rect
          :x="ep.x - 5"
          :y="ep.y - 5"
          width="10"
          height="10"
          class="zz-point"
          @pointerdown="dragStart('endPoint')"
        />
        <text :x="ep.x + 15" :y="ep.y + 15" font-size="12">
          x:{{ ep.x }} y:{{ ep.y }}
        </text>
      </g>
      <g>
        <path :d="startHandlePath" class="zz-handleline" />
        <circle
          :cx="sh.x"
          :cy="sh.y"
          r="5"
          class="zz-handle"
          @pointerdown="dragStart('startHandle')"
        />
        <text :x="sh.x + 15" :y="sh.y + 15" font-size="12">
          x:{{ sh.x }} y:{{ sh.y }}
        </text>
      </g>
      <g>
        <path :d="endHandlePath" class="zz-handleline" />
        <circle
          :cx="eh.x"
          :cy="eh.y"
          r="5"
          class="zz-handle"
          @pointerdown="dragStart('endHandle')"
        />
        <text :x="eh.x + 15" :y="eh.y + 15" font-size="12">
          x:{{ eh.x }} y:{{ eh.y }}
        </text>
      </g>
    </g>
  </g>
</template>

<script>
export default {
  data: () => ({
    isDragging: false,
    dragProp: '',
    startPoint: { x: 200, y: 200 },
    startHandle: { x: 350, y: 150 },
    endHandle: { x: 400, y: 500 },
    endPoint: { x: 600, y: 340 },
  }),
  computed: {
    sp() {
      return this.startPoint
    },
    sh() {
      return this.startHandle
    },
    eh() {
      return this.endHandle
    },
    ep() {
      return this.endPoint
    },
    startHandlePath() {
      const { sp, sh } = this
      return `M${sp.x},${sp.y} L${sh.x},${sh.y}`
    },
    endHandlePath() {
      const { ep, eh } = this
      return `M${ep.x},${ep.y} L${eh.x},${eh.y}`
    },
    connectorData() {
      const { sp, sh, eh, ep } = this
      return `M${sp.x},${sp.y} C${sh.x},${sh.y} ${eh.x},${eh.y} ${ep.x},${ep.y}`
    },
  },
  methods: {
    dragStart(prop) {
      this.isDragging = true
      this.dragProp = prop
    },
    dragStop() {
      this.isDragging = false
    },
    onMousemove(event) {
      if (!this.isDragging) return false
      const { offsetX, offsetY } = event
      this[this.dragProp].x = offsetX
      this[this.dragProp].y = offsetY
    },
  },
}
</script>

<style scoped>
.connector {
  fill: none;
  stroke: royalblue;
  stroke-width: 3px;
}

.zz-point {
  fill: rgba(30, 144, 255, 0.2);
  stroke: dodgerblue;
  stroke-width: 1;
  cursor: pointer;
}

.zz-handle {
  fill: rgba(30, 144, 255, 0.2);
  stroke: dodgerblue;
  stroke-width: 1;
  cursor: pointer;
}

.zz-handleline {
  stroke: dodgerblue;
  stroke-width: 1;
}

text {
  user-select: none;
}
</style>
