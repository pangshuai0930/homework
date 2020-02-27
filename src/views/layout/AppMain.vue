<template>
  <section class="app-main">
    <!-- 如需要开启 keep-alive 就取消下面的注释 -->
    <!-- <transition name="fade" mode="out-in">
      <keep-alive>
        <router-view v-if="!$route.meta.notKeepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="fade" mode="out-in">
      <router-view v-if="$route.meta.notKeepAlive"></router-view>
    </transition> -->
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
  export default {
    name: 'AppMain',
    computed: {
      key() {
        return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
      }
    }
  }
</script>