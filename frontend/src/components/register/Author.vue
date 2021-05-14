<template>
  <div>
    <PageTitle icon="fa fa-cogs" main="Cadastro de Autores"
      sub="Cadastros" />
    <div class="author">
      <b-form>
        <input id="author-id" type="hidden" v-model="author.id" />      
        <b-form-group label="Nome:" label-for="author-name">
          <b-form-input id="author-name" type="text"
            v-model="author.name" required
            :readonly="mode==='remove'"
            placeholder="Informe o nome..." />
        </b-form-group>   
        <b-button variant="primary" v-if="mode!='remove'" 
          @click="save">Salvar</b-button>
        <b-button variant="danger" v-if="mode==='remove'" 
          @click="remove">Excluir</b-button>
        <b-button class="ml-2" 
          @click="reset" >Cancelar</b-button>       
      </b-form>
      <hr>
      <b-table hover striped :items="authors" :fields="fields">
        <template slot="cell(actions)" slot-scope="data">
          <b-button variant="warning" @click="loadCategory(data.item)" class="mr-2">
            <i class="fa fa-pencil"></i>
          </b-button>
          <b-button variant="danger" @click="loadCategory(data.item, 'remove')" class="mr-2">
            <i class="fa fa-trash"></i>
          </b-button>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import { baseApiUrl, showError, showSuccessMsg } from '@/global'
import axios from 'axios'

export default {  
  name: 'Author',
  data: function() {
    return {
      mode: 'save',
      author: {
        name: ""
      },
      authors: [],
      fields: [
        { key: 'id', label: 'Código', sortable: true },
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'actions', label: 'Ações' }
      ]
    }
  },
  methods: {
    loadAuthors() {
      const url = `${baseApiUrl}/authors`
      axios.get(url).then(res => {
        // this.authors = res.data
        this.authors = res.data.map(author => {
          return { ...author, value: author.id }
        })
      })
    },
    reset() {
      this.mode = 'save'
      this.author = {}
      this.loadAuthors()
    },
    save() {
      const method = this.author.id ? 'put' : 'post'
      const id = this.author.id ? `/${this.author.id}` : ''
      axios[method](`${baseApiUrl}/authors${id}`, this.author)
        .then(res => {
          showSuccessMsg(res.data.message)
          this.reset()
        })
        .catch(showError)
    },
    remove() {
      const id = this.author.id
      axios.delete(`${baseApiUrl}/authors/${id}`)
        .then(res => {
          showSuccessMsg(res.data.message)
          this.reset()
        })
        .catch(showError)
    },
    loadCategory(author, mode = 'edit') {
      this.mode = mode
      this.author = { ...author }
    }
  },
  mounted() {
    this.loadAuthors()
  }
}
</script>

<style>

</style>