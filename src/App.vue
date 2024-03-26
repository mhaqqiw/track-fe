<template>
  <div id="app">
    <a-layout style="height: 100%;" class="qbody">
      <a-layout-content style="width: 100%;">
        <div :class="{ has_header: 'q_content' }" style="height: 100%;">
          <RouterView :user="this.user" :is_mobile="this.is_mobile" style="margin: 0 auto;" />
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import router from './js/router.js';

export default {
  data() {
    return {
      is_mobile: false,
      windowWidth: window.innerWidth,
      user: {
        name: null,
        email: null,
        id: null,
        picture: null,
        company_id: null,
        is_admin: false,
      },
    }
  },
  name: 'App',
  components: {
    // ViewTracker
  },
  async mounted() {
    await router.isReady();
    this.getRouterMeta();
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
  },
  methods: {
    getRouterMeta() {
      this.is_mobile = this.$isMobile();
      this.project_bind = this.$route.meta.project_bind;
      this.selectedMenu = [this.$route.name];
      let header_display = this.$route.meta.header_display;
      this.project_bind = this.$route.meta.project_bind;
      if (typeof header_display != "boolean") {
        header_display = true;
      }
      let need_login = this.$route.meta.header_display;
      if (typeof need_login != "boolean") {
        need_login = true;
      }
      this.has_header = header_display;
      this.need_login = need_login;
      if (this.has_header) {
        this.content_padding_top = "65px";
      } else {
        this.content_padding_top = "15px";
      }
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
  },
  watch: {
    windowWidth: function () {
      this.is_mobile = this.$isMobile();
    }
  }
}
//   mounted() {
//     // Register service worker here
//     if ('serviceWorker' in navigator) {
//       window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/service-worker.js').then(registration => {
//           console.log('Service Worker registered: ', registration);
//         }).catch(registrationError => {
//           console.log('Service Worker registration failed: ', registrationError);
//         });
//       });
//     }
//   }
// }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

/* Add responsive styles here */
@media screen and (max-width: 768px) {
  #app {
    margin-top: 30px;
  }
}

.qbody {
  display: flex;
  justify-content: center;
  align-items: center;
}

html {
  background: rgb(245, 245, 245);
}
</style>
