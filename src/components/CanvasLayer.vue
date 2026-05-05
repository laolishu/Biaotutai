<template>
  <template v-for="layer in layers" :key="layer.id">
    <template v-if="layer.type === 'group'">
      <CanvasLayer
        v-if="!layer.hidden && layer.children && layer.children.length"
        :layers="layer.children"
      />
    </template>

    <img
      v-else-if="!layer.hidden && layer.imagePreviewUrl"
      class="canvas-layer"
      :src="layer.imagePreviewUrl"
      :alt="layer.name || ''"
      :style="{
        left: layer.x + 'px',
        top: layer.y + 'px',
        width: layer.width + 'px',
        height: layer.height + 'px'
      }"
      draggable="false"
    />
  </template>
</template>

<script setup>
defineProps({
  layers: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.canvas-layer {
  position: absolute;
  display: block;
  object-fit: fill;
  pointer-events: none;
  user-select: none;
}
</style>
