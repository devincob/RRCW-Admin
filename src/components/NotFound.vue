<template>
  <x-page>
    <x-empty title="404 Not Found" text="很抱歉没有找到您需要的内容"/>
    <div style="width: 100%;text-align: center;">page: {{$route.fullPath}} not found.</div>
  </x-page>
</template>

<script>
export default {
  name: 'not-found'
}
</script>
