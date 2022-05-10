<template>
  <div v-if="ready" id="spz">
    <button id="spz-toggle" class="xc-CameraBtn" @click="toggleSpzPan">
      Camera: <b>{{ spzState }}</b>
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

<style lang="postcss" scoped>
#spz-toggle {
  position: absolute;
  bottom: 15px;
  left: 220px;
}

.xc-CameraBtn {
  @apply px-4 py-2;
  @apply leading-none text-sm;
  @apply text-white bg-indigo-500;
  @apply rounded;
  @apply shadow-md shadow-indigo-500/50;
}
</style>
