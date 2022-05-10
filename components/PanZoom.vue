<template>
  <div v-if="ready" id="spz">
    <button
      id="spz-toggle"
      class="border bg-indigo-100 px-2"
      @click="toggleSpzPan"
    >
      Controll: {{ spzState }}
    </button>
  </div>
</template>

<script>
import svgPanZoom from 'svg-pan-zoom'

export default {
  data: () => ({
    ready: false,
    spz: null,
    spzState: 'enabled',
  }),

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
    isEnabled() {
      return this.spz && this.spz.isPanEnabled()
    },
  },
}
</script>

<style scoped>
#spz-toggle {
  position: absolute;
  bottom: 15px;
  left: 220px;
}
</style>
