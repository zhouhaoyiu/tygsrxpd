<script lang="ts" setup></script>

<template>
  <div class="title">
    <h1>
      <slot name="title"></slot>
    </h1>
  </div>
</template>

<style lang="scss" scoped>
.title {
  height: 60px;
  line-height: 60px;
  // 比背景色稍深一点
  background-color: #bababa11;
  text-align: center;
  border-radius: 10px;
  margin-bottom: 10px;
  h1 {
    font-size: 30px;
    color: #333;
  }
}
</style>
