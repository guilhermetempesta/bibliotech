<template>
  <div>
    <PageTitle icon="fa fa-address-book" main="Cadastro de Autores"
      sub="Cadastros" />
    <div class="author">
      <b-form>
        <input id="author-id" type="hidden" v-model="author.id" />      
        <b-form-group label="Nome:" label-for="author-name"> 
          <b-form-input id="author-name" type="text" ref="authorName"
            v-model="author.name" required
            :readonly="mode==='remove'"
            placeholder="Informe o nome..." />
        </b-form-group>   
        <b-button variant="primary" v-if="mode!='remove'" ref="btnSave"
          @click="save">Salvar</b-button>
        <b-button variant="danger" v-if="mode==='remove'" ref="btnDelete" 
          @click="remove">Excluir</b-button>
        <b-button class="ml-2" ref="btnCancel"
          @click="reset" >Cancelar</b-button>       
      </b-form>
      <hr>
      <b-table hover striped :items="authors" :fields="fields">
        <template slot="cell(actions)" slot-scope="data">
          <b-button size="sm" variant="warning" @click="loadAuthor(data.item)" class="mr-2">
            <i class="fa fa-pencil"></i>
          </b-button>
          <b-button size="sm" variant="danger" @click="loadAuthor(data.item, 'remove')" class="mr-2">
            <i class="fa fa-times"></i>
          </b-button>
        </template>
      </b-table>
      <b-pagination align="center" size="md" v-model="page" :total-rows="count" :per-page="limit" />
    </div>
  </div>
</template>

<script>
import PageTitle from '../template/PageTitle'
import { baseApiUrl, showError, showSuccessMsg } from '@/global'
import axios from 'axios'

export default {  
  name: 'Author',
  components: { PageTitle },
  data: function() {
    return {
      mode: 'save',
      author: {
        name: ""
      },
      authors: [],
      page: 1,
      limit: 0,
      count: 0,
      fields: [
        { key: 'id', label: 'Código', sortable: true },
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'actions', label: 'Ações' }
      ]
    }
  },
  methods: {
    loadAuthors() {
      const url = `${baseApiUrl}/authors?page=${this.page}`
      axios.get(url).then(res => {
        this.count = res.data.count
        this.limit = res.data.limit
        this.authors = res.data.data
        this.authors = res.data.data.map(author => {
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
    loadAuthor(author, mode = 'edit') {
      this.mode = mode
      this.author = { ...author }
      this.$refs.authorName.focus();
    }
  },
  watch: {
    page() {
      this.loadAuthors()
    }
  },
  mounted() {
    this.loadAuthors()
  }
}
</script>

<style>

</style>