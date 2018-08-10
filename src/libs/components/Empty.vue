<template>
  <transition name="fade">
    <div class="ms-empty-toast-content text-center" :class="(circle?'circle ':' ') + size">
      <div class="toast-content-inner"
           :class="{'no-title-icon': noTitleIcon || (noIcon && noTitle), 'no-icon': noIcon, 'no-title': noTitle}">
        <div v-if="!noIcon && !noTitleIcon && icon" class="toast-icon"><i class="icon" :class="icon"
                                                                          :style="iconStyle"></i></div>
        <div v-if="!noTitle && !noTitleIcon" class="toast-title">
          <slot name="title">{{title}}</slot>
        </div>
        <div class="toast-text">
          <slot name="text">{{text}}</slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'x-empty',
  props: {
    icon: {
      'type': String,
      'default': 'el-icon-document'
    },
    iconStyle: String,
    circle: Boolean,
    text: {
      type: String,
      'default': '很抱歉没找到你需要的数据'
    },
    title: {
      type: String,
      'default': '暂无数据'
    },
    size: {
      type: String,
      'default': ''
    },
    noTitle: Boolean,
    noIcon: Boolean,
    noTitleIcon: Boolean
  },
  methods: {}
}
</script>
