<template>
  <aside class="menu" v-show="isMenuVisible">
    <hr>
    <router-link to="/">Início</router-link>
    <router-link to="/students">Alunos</router-link>
    <router-link to="/authors">Autores</router-link>
    <router-link to="/books">Livros</router-link>
    <router-link to="/loans">Empréstimos</router-link>
    <router-link to="/return">Devoluções</router-link>
    <router-link to="/report">Relatórios</router-link>
  </aside>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "Menu",
  components: {},
  computed: mapState(['isMenuVisible']),
  data: function() {
    return {
      
    }
  },
  methods: { 
    
  },
  mounted() {
    
  }
}
</script>

<style>
  .menu {
    grid-area: menu;
    background-color: #003153;
    display: flex;
    flex-direction: column;
    /* flex-wrap: wrap;  */
    overflow: auto;
  }

  .menu a {
    color: #d1d1d1;
    text-decoration: none;

    padding: 8px 8px 8px 32px;
    font-size: 25px;
    display: block;
    transition: 0.3s;
  }

  .menu a:hover {
    color: #fff;
    text-decoration: none;
  }
  
</style>