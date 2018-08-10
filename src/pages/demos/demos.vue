<template>
  <x-page title="DEMO">
    <table-demo ref="table"/>
  </x-page>
</template>

<script>
import TableDemo from '../../components/TableDemo'

export default {
  components: {TableDemo},
  name: 'demos',
  data(){
    return {
      loading: false
    }
  },
  methods: {
    onPageParamsChange(params){
      this.loading = true
      const loading = this.$loading({
        target: this.$refs.table.$el,
        text: '数据加载中...'
      })
      setTimeout(() => {
        this.loading = false
        loading.close()
      }, 1000)
    }
  }
}
</script>
