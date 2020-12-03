<template>
  <div id="app">
    <Loading v-show="isLoading" style="position:absolute;top:0;height:auto;width:100%;z-index:999;"></Loading>
    <router-view />
  </div>
</template>

<script>
import Loading from '@/components/Loading/Loading'
import { mapState } from "vuex"
export default {
  name: 'App',
  computed: {
 ...mapState(["isLoading"])
  },
  components:{
    Loading
  }
}
</script>
