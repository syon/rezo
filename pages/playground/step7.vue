<template>
  <main>
    <div id="canvas">
      <svg
        id="svg"
        width="100vw"
        height="100vh"
        xmlns="http://www.w3.org/2000/svg"
      >
        <template v-for="(pSet, idx) of lines">
          <auto-bezier :key="`bez-${idx}`" :sp="pSet.sp" :ep="pSet.ep" />
        </template>

        <template v-for="(b, idx) of questBoxSet">
          <foreignObject
            :key="`fo-${idx}`"
            width="160"
            height="160"
            :x="b.x"
            :y="b.y"
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
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import svgPanZoom from 'svg-pan-zoom'

export default {
  name: 'Step7Page',
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
  },
  mounted() {
    svgPanZoom('#svg', {
      controlIconsEnabled: true,
      zoomScaleSensitivity: 0.3,
      minZoom: 0.1,
    })
  },
}
</script>

<style>
body {
  background-color: #e8eaed;
}

#canvas {
  width: 100%;
}

svg {
  border: 1px solid #eee;
  box-shadow: 0 2px 12px 4px rgba(0, 0, 0, 0.01);
  margin: 0 auto;
  background-color: #eeeff2;
}
</style>
