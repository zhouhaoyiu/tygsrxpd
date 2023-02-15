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
  user-select: none;
  height: 60px;
  line-height: 60px;
  // 比背景色稍深一点
  background-color: #bababa11;
  text-align: center;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0px 0px 8px 1px #e1e1e1cc;
  h1 {
    font-size: 30px;
    color: #333;
  }
}
</style>
