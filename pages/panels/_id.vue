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
        <g @pointerdown="enableCamera">
          <g class="grp-mousecross">
            <path :d="scaledMouseXLine" stroke="cyan" />
            <path :d="scaledMouseYLine" stroke="cyan" />
          </g>

          <g class="grp-autobezier">
            <template v-for="(pSet, idx) of lines">
              <auto-bezier :key="`bez-${idx}`" :sp="pSet.sp" :ep="pSet.ep" />
            </template>
          </g>

          <g class="grp-foreignobject">
            <template v-for="(b, key) of questBoxSet">
              <foreignObject
                :key="`fo-${key}`"
                width="200"
                :height="b.drawSockets.length * 20 + 50"
                :x="b.x"
                :y="b.y"
                class="shadow-lg rounded"
                @mousemove="enterBox($event, key)"
              >
                <node-box
                  :id="key"
                  :obj="b"
                  @on-click-title="onBoxTitleClick"
                  @on-dblclick-title="onBoxTitleDblclick"
                  @on-click-socket="onBoxSocketClick"
                  @on-dblclick-socket="onBoxSocketDblclick"
                />
              </foreignObject>
            </template>
          </g>

          <g class="grp-skeleton">
            <template v-for="(obj, key) of skeletonSet">
              <g :key="`ske-${key}`">
                <text :x="obj.mx" :y="obj.my - 5" font-size="10" fill="red">
                  {{ key }} / x:{{ obj.mx }} y:{{ obj.my }}
                </text>

                <rect
                  width="200"
                  :height="obj.h"
                  :x="obj.mx"
                  :y="obj.my"
                  fill="none"
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
                    <circle
                      :cx="inp.x"
                      :cy="inp.y"
                      r="5"
                      fill="gray"
                      class="cursor-pointer"
                      @click="detachSocket(key, idx)"
                    />
                  </template>
                </g>
                <circle :cx="obj.out.x" :cy="obj.out.y" r="5" fill="orange" />
                <g>
                  <rect
                    :x="obj.plus.x - 13"
                    :y="obj.plus.y - 2"
                    width="8"
                    height="4"
                    class="fill-cyan-400/50 cursor-pointer"
                    @pointerdown="dragPlusStart($event, key)"
                  />
                  <circle
                    :cx="obj.plus.x"
                    :cy="obj.plus.y"
                    r="6"
                    class="fill-cyan-400/50 cursor-pointer"
                    @pointerdown="dragPlusStart($event, key)"
                  />
                </g>
                <rect
                  :x="obj.mx + 18"
                  :y="obj.plus.y - 4"
                  width="50"
                  height="8"
                  class="EditBtn"
                  @click="handleAddFactSocket(key)"
                />
              </g>
            </template>
          </g>

          <g class="grp-previewline">
            <template v-if="isPlusDragging">
              <auto-bezier :sp="previewLineSrc" :ep="previewLineDst" />
              <text
                :x="scaledMouseX"
                :y="scaledMouseY"
                font-size="14"
                fill="red"
              >
                {{ lastEnterBoxId }}
              </text>
            </template>
          </g>
        </g>
      </svg>

      <pan-zoom ref="camera" />

      <fact-list />

      <div id="toolbar">
        <button class="xc-NewUnitBtn" @click="newQuestBox">new</button>
        <div class="mt-4 text-xs">
          <div>isBoxDragging: {{ isBoxDragging }}</div>
          <div>dragBoxId: {{ dragBoxId }}</div>
          <div>isPlusDragging: {{ isPlusDragging }}</div>
          <div>lastEnterBoxId: {{ lastEnterBoxId }}</div>
        </div>
      </div>

      <unit-editor ref="uniteditor" />
      <socket-editor ref="socketeditor" />
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PanelPage',

  data: () => ({
    scaledMouseX: 0,
    scaledMouseY: 0,
    isBoxDragging: false,
    isPlusDragging: false,
    lastEnterBoxId: null,
    dragBoxId: null,
    dragOffset: { x: 0, y: 0 },
    previewLineSrc: { x: 0, y: 0 },
    previewLineDst: { x: 0, y: 0 },
    ingSocketEdit: false,
    vSocketLabel: null,
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
          for (let i = 0; i < (drawSockets || []).length; i++) {
            const { type } = drawSockets[i]
            inPoints.push({ x, y: y + 20 * i + 53, type })
            h += 19
          }
          const val = {
            mx: x,
            my: y,
            in: inPoints,
            out: { x: x + 200, y: y + 18 },
            h,
            plus: { x, y: y + h },
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

  async mounted() {
    await this.init()
  },

  methods: {
    async init() {
      const panel = this.$route.params.id
      await this.$store.dispatch('quest/init', panel)
      this.$refs.camera.init()
    },
    enableCamera() {
      this.$refs.camera.enableSpzPan()
    },
    onBoxTitleClick(boxId, pt) {
      this.$refs.camera.disableSpzPan()
      this.isBoxDragging = true
      this.dragBoxId = boxId
      this.dragOffset = pt
    },
    onBoxTitleDblclick(boxId) {
      this.$refs.uniteditor.open(boxId)
    },
    onBoxSocketClick(soc) {
      this.$refs.camera.disableSpzPan()
    },
    onBoxSocketDblclick(boxId, soc) {
      this.$refs.socketeditor.open(boxId, soc)
    },
    enterBox(event, key) {
      if (this.isPlusDragging) {
        event.stopPropagation()
        this.lastEnterBoxId = key
      }
    },
    dragPlusStart(event, boxId) {
      event.stopPropagation()
      this.$refs.camera.disableSpzPan()
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
      if (this.isBoxDragging) {
        this.updateBoxPos({ boxId: this.dragBoxId })
        this.isBoxDragging = false
        this.dragBoxId = null
      }
      if (this.isPlusDragging) {
        this.newAliasSocket()
        this.isPlusDragging = false
        this.lastEnterBoxId = null
      }
    },
    onMousemove(event) {
      this.refreshMousePos(event)

      if (this.$refs.camera.isEnabled()) return

      if (this.isBoxDragging && this.dragBoxId) {
        const payload = {
          id: this.dragBoxId,
          x: this.scaledMouseX - this.dragOffset.x,
          y: this.scaledMouseY - this.dragOffset.y,
        }
        this.$store.dispatch('quest/updatePositionOnMemory', payload)
      } else if (this.isPlusDragging) {
        this.previewLineSrc = {
          x: this.scaledMouseX,
          y: this.scaledMouseY,
        }
        if (this.lastEnterBoxId) {
          this.lastEnterBoxId = null
        }
      }
    },
    refreshMousePos(event) {
      try {
        const { x, y } = event
        const matrix = this.detectMatrix()
        const calcX = (x - matrix.transX) / matrix.scaleX
        const calcY = (y - matrix.transY) / matrix.scaleY
        this.scaledMouseX = calcX
        this.scaledMouseY = calcY
      } catch (e) {}
    },
    detectMatrix() {
      const vp = this.$el.querySelector('.svg-pan-zoom_viewport')
      const vpmx = vp.transform.baseVal.consolidate().matrix
      // https://ginpen.com/2018/11/13/understanding-transform-matrix/
      return { scaleX: vpmx.a, scaleY: vpmx.d, transX: vpmx.e, transY: vpmx.f }
    },
    updateBoxPos({ boxId, x, y }) {
      const payload = { boxId, x, y }
      this.$store.dispatch('quest/savePosition', payload)
    },
    newAliasSocket() {
      if (!this.dragBoxId || !this.lastEnterBoxId) return
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
    handleAddFactSocket(key) {
      const payload = {
        questId: key,
        socketId: null,
        type: 'fact',
      }
      this.$store.dispatch('quest/addSocket', payload)
    },
    detachSocket(questId, socketIndex) {
      const payload = { questId, socketIndex }
      this.$store.dispatch('quest/detachSocket', payload)
    },
  },
}
</script>

<style lang="postcss">
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

#toolbar {
  position: absolute;
  top: 20px;
  left: 230px;
}

.EditBtn {
  @apply fill-cyan-400/50;
  font-size: 10px;
  cursor: pointer;
}

.xc-NewUnitBtn {
  @apply px-4 py-2;
  @apply leading-none;
  @apply text-white bg-cyan-500;
  @apply rounded;
  @apply shadow-md shadow-cyan-500/50;
}
</style>
