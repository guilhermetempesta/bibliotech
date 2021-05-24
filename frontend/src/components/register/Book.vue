<template>
  <div>
    <PageTitle icon="fa fa-book" main="Cadastro de Obras Literárias"
      sub="Cadastros" />
    <div class="book-admin">
      <b-form>
        <input id="book-id" type="hidden" v-model="book.id" />      
        <b-row>
          <b-col> 
            <b-form-group label="Título:" label-for="book-title">
              <b-form-input id="book-title" type="text" 
                v-model="book.title" required autofocus
                :readonly="mode==='remove'" ref="bookTitle"
                placeholder="Informe o título da obra..." />
            </b-form-group>
          </b-col>
          <b-col md="3" sm="6">
            <b-form-group label="Código:" label-for="book-code">
              <b-form-input id="book-code" type="text"
              v-model="book.code" required
              :readonly="mode==='remove'"
              placeholder="Informe o código da obra..." />
            </b-form-group>
          </b-col>
        </b-row>  

        <b-form-group v-if="mode!='remove'"  
          label="Autor:" label-for="book-authorId">
          <b-input-group>
            <b-form-select id="book-authorId" :options="authors" v-model="book.author.id" />
            <b-input-group-append>
              <b-button v-b-modal.modal-prevent-closing variant="success">Novo</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <template>
          <div>
            <b-modal id="modal-prevent-closing" ref="modal" title="Cadastro de autores"
              @show="resetModal" @hidden="resetModal" @ok="handleOk">
              <b-form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group label="Nome" label-for="name-input" 
                  invalid-feedback="O nome é obrigatório!" :state="authorNameState">
                  <b-form-input id="name-input" v-model="authorName" ref="authorName"
                    :state="authorNameState" required autofocus/>
                </b-form-group>
              </b-form>
            </b-modal>
          </div>
        </template>

        <b-row>
          <b-col md="6" sm="12">
            <b-form-group v-if="mode!='remove'"  
              label="Editora:" label-for="book-publisher">
              <b-form-input id="book-publisher" type="text"
                v-model="book.publisher" required
                :readonly="mode==='remove'"
                placeholder="Informe o nome da editora..." />
            </b-form-group> 
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group v-if="mode!='remove'"  
              label="Localização:" label-for="book-localization">
              <b-form-input id="book-localization" type="text"
                v-model="book.localization" required
                :readonly="mode==='remove'"
                placeholder="Informe o número da prateleira..." />
            </b-form-group> 
          </b-col>
        </b-row>
        
        
        <b-button variant="primary" v-if="mode!='remove'" 
          @click="save">Salvar</b-button>
        <b-button variant="danger" v-if="mode==='remove'" 
          @click="remove">Excluir</b-button>
        <b-button class="ml-2" 
          @click="reset" >Cancelar</b-button>       
      </b-form>
      <hr>
      <b-table hover striped :items="books" :fields="fields">
        <template slot="cell(actions)" slot-scope="data">
          <b-button variant="warning" @click="loadBook(data.item)" class="mr-2">
            <i class="fa fa-pencil"></i>
          </b-button>
          <b-button variant="danger" @click="loadBook(data.item, 'remove')" class="mr-2">
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
  name: 'Book',
  components: { PageTitle },
  data: function() {
    return {
      mode: 'save',
      book: {
        code: "",
        title: "",
        publisher: "",
        localization: "",
        author: {}
      },
      books: [],
      authors: [],
      page: 1,
      limit: 0,
      count: 0,
      fields: [
        { key: 'id', label: 'Id.', sortable: true },
        { key: 'code', label: 'Código', sortable: true },
        { key: 'title', label: 'Título', sortable: true },
        { key: 'author.name', label: 'Autor', sortable: true },
        { key: 'actions', label: 'Ações' }
      ],
      authorName: '',
      authorNameState: null
    }
  },
  methods: {
    loadBooks() {
      const url = `${baseApiUrl}/books?page=${this.page}`
      axios.get(url).then(res => {
        this.books = res.data.data
        this.count = res.data.count
        this.limit = res.data.limit
      })
    },
    reset() {
      this.mode = 'save'
      this.book = {
        code: "",
        title: "",
        publisher: "",
        localization: "",
        author: {}
      }
      this.loadBooks()
    },
    save() {
      this.book.authorId = this.book.author.id     
      const method = this.book.id ? 'put' : 'post'
      const id = this.book.id ? `/${this.book.id}` : ''
      axios[method](`${baseApiUrl}/books${id}`, this.book)
        .then(res => {
          showSuccessMsg(res.data.message)
          this.reset()
        })
        .catch(showError)
    },
    remove() {
      const id = this.book.id
      axios.delete(`${baseApiUrl}/books/${id}`)
        .then(res => {
          showSuccessMsg(res.data.message)
          this.reset()
        })
        .catch(showError)
    },
    loadBook(book, mode = 'edit') {
      this.mode = mode
      axios.get(`${baseApiUrl}/books/${book.id}`)
        .then(res => {
          this.book = res.data
          this.$refs.bookTitle.focus();
        })
    },
    loadAuthors() {
      const url = `${baseApiUrl}/authors`
      axios.get(url).then(res => {
        this.authors = res.data.map(author => {
          return { value: author.id, text: author.name }
        })
      })
    },
    // teste modal
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.authorNameState = valid
      return valid
    },
    resetModal() {
      this.authorName = ''
      this.authorNameState = null
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      // Store new author
      const newAuthor = {
        name: this.authorName
      }
      axios.post(`${baseApiUrl}/authors`, newAuthor)
        .then(res => {
          const newAuthor = res.data
          this.resetModal()
          this.loadAuthors()
          // Hide the modal manually
          this.$nextTick(() => {
            this.$bvModal.hide('modal-prevent-closing')
          })
          this.book.author = newAuthor
        })
        .catch(showError)    
    }
  },
  watch: {
    page() {
      this.loadBooks()
    }
  },
  mounted() {
    this.loadAuthors()
    this.loadBooks()
    this.$refs.bookTitle.focus();
  }
}
</script>

<style>

</style>