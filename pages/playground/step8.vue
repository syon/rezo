<template>
  <main>
    <div id="canvas">
      <svg
        id="svg"
        width="100vw"
        height="100vh"
        xmlns="http://www.w3.org/2000/svg"
        @mousemove="onMousemove"
        @pointerup="dragStop"
      >
        <g>
          <path :d="scaledMouseXLine" stroke="cyan" />
          <path :d="scaledMouseYLine" stroke="cyan" />
        </g>

        <template v-for="(pSet, idx) of lines">
          <auto-bezier :key="`bez-${idx}`" :sp="pSet.sp" :ep="pSet.ep" />
        </template>

        <template v-for="(b, key) of questBoxSet">
          <foreignObject
            :key="`fo-${key}`"
            width="160"
            height="160"
            :x="b.x"
            :y="b.y"
            @pointerdown="dragStart(key)"
          >
            <node-box2 :obj="b" />
          </foreignObject>
        </template>

        <template v-for="(obj, key) of skeletonSet">
          <g :key="`ske-${key}`">
            <text :x="obj.mx" :y="obj.my - 5" font-size="10" fill="red">
              {{ key }} / x:{{ obj.mx }} y:{{ obj.my }}
            </text>
            <rect
              width="160"
              :height="obj.h"
              :x="obj.mx"
              :y="obj.my"
              fill="none"
              stroke="red"
            />
            <g v-for="(inp, idx) of obj.in" :key="`inp-${idx}`">
              <circle :cx="inp.x" :cy="inp.y" r="5" fill="red" />
            </g>
            <circle :cx="obj.out.x" :cy="obj.out.y" r="5" fill="orange" />
          </g>
        </template>
      </svg>

      <div v-if="ready" id="spz">
        <button
          id="spz-pan"
          class="border bg-indigo-100 px-2"
          @click="toggleSpzPan"
        >
          Controll: {{ spzState }}
        </button>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import svgPanZoom from 'svg-pan-zoom'

export default {
  name: 'Step8Page',
  data: () => ({
    ready: false,
    spz: null,
    spzState: 'enabled',
    scaledMouseX: 0,
    scaledMouseY: 0,
    isDragging: false,
    dragProp: '',
  }),
  computed: {
    ...mapGetters({
      questBoxSet: 'quest/questBoxSet',
      questBonds: 'quest/questBonds',
    }),
    skeletonSet() {
      const boxSet = this.questBoxSet
      return Object.fromEntries(
        Object.entries(boxSet).map(([key, box]) => {
          const { x, y, reqs } = box
          const inPoints = []
          let h = 60
          for (let i = 0; i < reqs.length; i++) {
            inPoints.push({ x, y: y + 20 * i + 53 })
            h += 18
          }
          const val = {
            mx: x,
            my: y,
            in: inPoints,
            out: { x: x + 160, y: y + 18 },
            h,
          }
          return [key, val]
        })
      )
    },
    lines() {
      const bonds = this.questBonds
      return bonds.map((b) => {
        const sBox = this.skeletonSet[b.src]
        const dBox = this.skeletonSet[b.dst]
        return {
          sp: sBox.out,
          ep: dBox.in[b.dstidx],
        }
      })
    },
    scaledMouseXLine() {
      const mx = this.scaledMouseX
      const my = this.scaledMouseY
      return `M${mx},${my - 100} L${mx},${my + 100}`
    },
    scaledMouseYLine() {
      const mx = this.scaledMouseX
      const my = this.scaledMouseY
      return `M${mx - 100},${my} L${mx + 100},${my}`
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.spz = svgPanZoom('#svg', {
        controlIconsEnabled: true,
        zoomScaleSensitivity: 0.3,
        minZoom: 0.1,
      })
      this.ready = true
    },
    toggleSpzPan() {
      if (this.spz.isPanEnabled()) {
        this.spz.disablePan()
        this.spz.disableZoom()
        this.spz.disableDblClickZoom()
        this.spzState = 'disabled'
      } else {
        this.spz.enablePan()
        this.spz.enableZoom()
        this.spz.enableDblClickZoom()
        this.spzState = 'enabled'
      }
    },
    dragStart(prop) {
      this.isDragging = true
      this.dragProp = prop
    },
    dragStop() {
      this.isDragging = false
    },
    onMousemove(event) {
      this.refreshMousePos(event)
    },
    refreshMousePos(event) {
      const { x, y } = event
      const matrix = this.detectMatrix()
      const calcX = (x - matrix.transX) / matrix.scaleX
      const calcY = (y - matrix.transY) / matrix.scaleY
      this.scaledMouseX = calcX
      this.scaledMouseY = calcY
    },
    detectMatrix() {
      const vp = this.$el.querySelector('.svg-pan-zoom_viewport')
      const vpmx = vp.transform.baseVal.consolidate().matrix
      // https://ginpen.com/2018/11/13/understanding-transform-matrix/
      return { scaleX: vpmx.a, scaleY: vpmx.d, transX: vpmx.e, transY: vpmx.f }
    },
  },
}
</script>

<style>
body {
  background-color: #e8eaed;
}

#canvas {
  position: relative;
  width: 100%;
}

svg {
  border: 1px solid #eee;
  box-shadow: 0 2px 12px 4px rgba(0, 0, 0, 0.01);
  margin: 0 auto;
  background-color: #eeeff2;
}

#spz-pan {
  position: absolute;
  bottom: 10px;
  left: 10px;
}
</style>
