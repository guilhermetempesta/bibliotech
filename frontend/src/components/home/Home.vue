<template>
  <div class="home">
    <PageTitle icon="fa fa-home" main="Início"
      sub="Bibliotech" />
    <div class="shortcuts">
      <Shortcut title="Alunos" path="/students"
        icon="fa fa-graduation-cap" color="#376B8C" />
      <Shortcut title="Autores" path="/authors"
        icon="fa fa-address-book" color="#376B8C" />
      <Shortcut title="Livros" path="/books"
        icon="fa fa-book" color="#376B8C" />
    </div>
    <div class="shortcuts">
      <Shortcut title="Empréstimo" path="/loans"
        icon="fas fa-book-open" color="#376B8C" />
      <Shortcut title="Devolução" path="/return"
        icon="fas fa-undo" color="#376B8C" />
      <Shortcut title="Relatório" path="/report"
        icon="fas fa-file" color="#376B8C" />  
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