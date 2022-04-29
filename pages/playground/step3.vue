<template>
  <main>
    <div id="canvas">
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <template v-for="(pSet, idx) of lines">
          <auto-bezier-info :key="`bez-${idx}`" :sp="pSet.sp" :ep="pSet.ep" />
        </template>
<!--
        <template v-for="(b, idx) of boxes">
          <foreignObject
            :key="`fo-${idx}`"
            width="160"
            height="160"
            :x="b.x"
            :y="b.y"
          >
            <node-box />
          </foreignObject>
        </template> -->

        <template v-for="(obj, key) of skeletonSet">
          <g :key="`ske-${key}`">
            <text :x="obj.mx" :y="obj.my - 5" font-size="10" fill="red">
              x:{{ obj.mx }} y:{{ obj.my }}
            </text>
            <rect
              width="160"
              height="160"
              :x="obj.mx"
              :y="obj.my"
              fill="none"
              stroke="red"
            />
            <circle :cx="obj.in.x" :cy="obj.in.y" r="5" fill="red" />
            <circle :cx="obj.out.x" :cy="obj.out.y" r="5" fill="orange" />
          </g>
        </template>
      </svg>
    </div>
  </main>
</template>

<script>
export default {
  name: 'Step3Page',
  computed: {
    boxes() {
      return {
        aaa: { x: 40, y: 30 },
        bbb: { x: 280, y: 50 },
        ccc: { x: 540, y: 80 },
        ddd: { x: 60, y: 280 },
        eee: { x: 320, y: 360 },
        fff: { x: 560, y: 300 },
      }
    },
    skeletonSet() {
      return Object.fromEntries(
        Object.entries(this.boxes).map(([key, box]) => {
          const { x, y } = box
          const val = {
            mx: x,
            my: y,
            in: { x, y: y + 18 },
            out: { x: x + 160, y: y + 18 },
          }
          return [key, val]
        })
      )
    },
    lines() {
      const bonds = [
        { src: 'aaa', dst: 'bbb' },
        { src: 'bbb', dst: 'ccc' },
        { src: 'ddd', dst: 'eee' },
        { src: 'eee', dst: 'fff' },
        { src: 'bbb', dst: 'fff' },
        { src: 'ddd', dst: 'ccc' },
      ]
      return bonds.map((b) => {
        const sBox = this.skeletonSet[b.src]
        const dBox = this.skeletonSet[b.dst]
        return {
          sp: sBox.out,
          ep: dBox.in,
        }
      })
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
