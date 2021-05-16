<template>
  <div class="home">
    <PageTitle icon="fa fa-home" main="Início"
      sub="Bibliotech" />
    <div class="shortcuts">
      <Shortcut title="Alunos" path="/students"
        icon="fa fa-graduation-cap" color="#3bc480" />
      <Shortcut title="Autores" path="/authors"
        icon="fa fa-address-book" color="#d54d50" />
      <Shortcut title="Livros" path="/books"
        icon="fa fa-book" color="#3282cd" />
    </div>
  </div>
</template>

<script>
import PageTitle from '../template/PageTitle'
import Shortcut from './Shortcut'

export default {
  name: 'Home',
  components: { PageTitle, Shortcut },
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
  .shortcuts {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
</style>