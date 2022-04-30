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
        <g @pointerdown="enableSpzPan">
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
              @pointerdown="dragBoxStart($event, key)"
              @pointerenter="enterBox($event, key)"
            >
              <node-box :obj="b" />
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
                <template v-if="inp.type === 'fact'">
                  <rect
                    :x="inp.x - 5"
                    :y="inp.y - 5"
                    width="10"
                    height="10"
                    fill="silver"
                  />
                </template>
                <template v-else>
                  <circle :cx="inp.x" :cy="inp.y" r="5" fill="gray" />
                </template>
              </g>
              <circle :cx="obj.out.x" :cy="obj.out.y" r="5" fill="orange" />
              <circle
                :cx="obj.plus.x"
                :cy="obj.plus.y"
                r="7"
                fill="red"
                @pointerdown="dragPlusStart($event, key)"
              />
            </g>
          </template>

          <auto-bezier
            v-if="isPlusDragging"
            :sp="previewLineSrc"
            :ep="previewLineDst"
          />
        </g>
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
      <div id="toolbar">
        <button class="border px-2" @click="newQuestBox">new</button>
        <fact-list />
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import svgPanZoom from 'svg-pan-zoom'

export default {
  name: 'Step9Page',
  data: () => ({
    ready: false,
    spz: null,
    spzState: 'enabled',
    scaledMouseX: 0,
    scaledMouseY: 0,
    isBoxDragging: false,
    isPlusDragging: false,
    lastEnterBoxId: null,
    dragBoxId: null,
    dragOffset: { x: 0, y: 0 },
    previewLineSrc: { x: 0, y: 0 },
    previewLineDst: { x: 0, y: 0 },
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
          const { x, y, drawSockets } = box
          const inPoints = []
          let h = 60
          for (let i = 0; i < drawSockets.length; i++) {
            const { type } = drawSockets[i]
            inPoints.push({ x, y: y + 20 * i + 53, type })
            h += 18
          }
          const val = {
            mx: x,
            my: y,
            in: inPoints,
            out: { x: x + 160, y: y + 18 },
            h,
            plus: { x: x + 160 / 2, y: y + h },
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
        this.disableSpzPan()
      } else {
        this.enableSpzPan()
      }
    },
    enableSpzPan() {
      this.spz.enablePan()
      this.spz.enableZoom()
      this.spz.enableDblClickZoom()
      this.spzState = 'enabled'
    },
    disableSpzPan() {
      this.spz.disablePan()
      this.spz.disableZoom()
      this.spz.disableDblClickZoom()
      this.spzState = 'disabled'
    },
    dragBoxStart(event, boxId) {
      event.stopPropagation()
      this.disableSpzPan()
      this.isBoxDragging = true
      this.dragBoxId = boxId
      const { offsetX, offsetY } = event
      this.dragOffset = { x: offsetX, y: offsetY }
    },
    enterBox(event, key) {
      this.lastEnterBoxId = key
    },
    dragPlusStart(event, boxId) {
      event.stopPropagation()
      this.disableSpzPan()
      this.isBoxDragging = false
      this.isPlusDragging = true
      this.dragBoxId = boxId
      const { offsetX, offsetY } = event
      this.dragOffset = { x: offsetX, y: offsetY }
      this.previewLineDst = {
        x: this.scaledMouseX,
        y: this.scaledMouseY,
      }
    },
    dragStop() {
      this.isBoxDragging = false
      if (this.isPlusDragging) {
        this.newSocket()
        this.isPlusDragging = false
      }
      this.dragBoxId = null
    },
    onMousemove(event) {
      this.refreshMousePos(event)
      if (!this.dragBoxId) return
      if (this.spz.isPanEnabled()) return

      if (this.isBoxDragging) {
        const payload = {
          id: this.dragBoxId,
          x: this.scaledMouseX - this.dragOffset.x,
          y: this.scaledMouseY - this.dragOffset.y,
        }
        this.$store.dispatch('quest/changeQuestItem', payload)
      } else if (this.isPlusDragging) {
        this.previewLineSrc = {
          x: this.scaledMouseX,
          y: this.scaledMouseY,
        }
      }
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
    newSocket() {
      const payload = {
        questId: this.dragBoxId,
        socketId: this.lastEnterBoxId,
        type: 'alias',
      }
      this.$store.dispatch('quest/addSocket', payload)
    },
    newQuestBox() {
      this.$store.dispatch('quest/addQuestItem')
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

#toolbar {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
