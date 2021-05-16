<template>
  <header class="header">
    <a class="toggle" @click="toggleMenu" v-if="!hideToggle">
      <i class="fa fa-lg" :class="icon"></i>
    </a>    
    <h1 class="title">
      <router-link v-if="loggedUser" to="/"> 
        <!-- {{ title }} -->
        <img src="@/assets/logo_side_invert.png" alt="">
      </router-link>
      <router-link v-else to="">
        <img src="@/assets/logo_side_invert.png" alt="">
        <!-- {{ title }} -->
      </router-link>
    </h1>
    <UserDropdown v-if="!hideUserDropdown" />
  </header>
</template>

<script>
import UserDropdown from './UserDropdown'
export default {
  name: 'Header',
  components: { UserDropdown },
  props: {
    title: String,
    hideToggle: Boolean,
    hideUserDropdown: Boolean
  },
  computed: {
    icon() {
      // return this.$store.state.isMenuVisible ? "fa-angle-left" : "fa-angle-down"
      return "fa-bars"
    },
    loggedUser() {
      return this.$store.state.user
    }
  },
  methods: {
    toggleMenu() {
      this.$store.commit('toggleMenu')
    }
  }
}
</script>

<style>
  .header{
    grid-area: header;
    /* background: linear-gradient(to right, #1e469a, #49a7c1); */
    background: linear-gradient(to right, #003153, #376B8C);
    color: #efefef;
    display: flex;
    justify-content: center;
    align-items: center; 
  }

  .title {
    font-size: 1.2rem;
    color: #fff;
    font-weight: 100;
    flex-grow: 1;
    text-align: left;
    margin-top: 10px;
  }

  .title a {
    color: #fff;
    text-decoration: none;    
  }

  .title a:hover {
    color: #fff;
    text-decoration: none;    
  }

  header.header > a.toggle {
    width: 60px;
    height: 100%;
    color: #fff;
    justify-self: flex-start;
    text-decoration: none;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  header.header > a.toggle:hover {
    background-color: rgba(0,0,0,0.3);
    color: #fff;
  }
</style>