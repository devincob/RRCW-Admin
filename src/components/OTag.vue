<template>
  <span
    :style="{background: background,
    color: color,
    'border-radius': '5px',
    'font-size': '10px',
    'padding': '2px'}">
    <slot></slot>
  </span>
</template>
<script>
export default {
  name: 'o-tag',
  data() {
    return {
    }
  },
  props: {
    background: {default: '#666'},
    color: {default: '#fff'}
  },
  methods: {

  },
  mounted() {

  }
}
</script>
<style lang="scss" scoped>
</style>
