<template>
  <div>
    <PageTitle icon="fas fa-file" main="Relatórios"
      sub="" /> 
    <div class="link">
      <b-button id="btn-link" variant="primary">
        <router-link to="/report/students">Alunos</router-link>          
      </b-button>
    </div>  
    <br/>
    <div class="link">
      <b-button id="btn-link" variant="primary">
        <router-link to="/report/books">Livros</router-link>          
      </b-button>
    </div>  
    <br/>
    <div class="link">
      <b-button id="btn-link" variant="primary">
        <router-link to="/report/loaned-books">Livros Emprestados</router-link>          
      </b-button>
    </div>  
    <br/>
    <div class="link">
      <b-button id="btn-link" variant="primary">
        <router-link to="/report/returned-books">Devoluções</router-link>          
      </b-button>
    </div>
    <br/>
    <div class="link">
      <b-button id="btn-link" variant="primary">
        <router-link to="/report/book-history">Histórico do Livro</router-link>          
      </b-button>
    </div> 
  </div>
</template>

<script>
import PageTitle from '../template/PageTitle'

export default {  
  name: 'Reports',
  components: { PageTitle },
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
  #btn-link {
    width: 265px;
  }

  .link a {
    color: #fff;
    text-decoration: none;
    padding: 8px 8px 8px 8px;
    font-size: 25px;
  }

  .link a:hover {
    color: #fff;
    text-decoration: none;
  }
</style>