<template>
  <main>
    <div id="canvas">
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <editable-bezier />
        <auto-bezier-debug />
      </svg>
    </div>
  </main>
</template>

<script>
export default {
  name: 'Step1Page',
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
