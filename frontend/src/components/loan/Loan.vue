<template>
  <div>
    <PageTitle icon="fas fa-book-open" main="Empréstimo de Obras Literárias"
      sub="Empréstimo" />
    <div class="loan">
      <b-form>
        <b-row>
          <b-col md="3" sm="6">
            <b-form-group label="Data do Empréstimo:" label-for="loan-date">
              <b-form-input id="loan-date" type="date" v-model="loan.loanDate" 
                v-on:blur="setReturnDate()" required autofocus 
                autocomplete="off" :readonly="mode!='save'" ref="loanDate" max="9999-12-31" 
              />
            </b-form-group>
          </b-col>
          <b-col md="3" sm="6">
            <b-form-group label="Data para Devolução:" label-for="return-date">
              <b-form-input id="return-date" type="date" 
                v-model="loan.returnDate" required autocomplete="off"
                :readonly="mode==='remove'" ref="returnDate" max="9999-12-31" 
              />
            </b-form-group>
          </b-col>
        </b-row>
      
        <b-form-group  
          label="Aluno:" label-for="loan-studentId">
          <b-input-group  v-if="mode!='remove'">
            <b-form-select id="loan-studentId" :options="students" v-model="loan.student.id" />
          </b-input-group>
          <b-form-input v-else readonly type="text" 
            id="loan-studentName" v-model="loan.student.name"/>
        </b-form-group>  
      
        <b-row>
          <b-col>
            <b-form-group  
              label="Livro:" label-for="loan-bookId">
              <b-input-group v-if="mode!='remove'">
                <b-form-select id="loan-bookId" :options="books" v-model="loan.book.id"/>
              </b-input-group>
              <b-form-input v-else readonly type="text" 
                id="loan-bookName" v-model="loan.book.title"/>
            </b-form-group>
          </b-col>
          <b-col md="3" sm="6">
            <b-form-group label="Número:" label-for="loan-bookNumber">
              <b-form-input id="loan-bookNumber" type="text"
              v-model="loan.bookNumber" required
              :readonly="mode==='remove'"
              placeholder="Informe o número do livro..." />
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
      <b-table hover striped :items="loans" :fields="fields">
        <template slot="cell(actions)" slot-scope="data">
          <b-button variant="warning" @click="loadLoan(data.item)" class="mr-2">
            <i class="fa fa-pencil"></i>
          </b-button>
          <b-button variant="danger" @click="loadLoan(data.item, 'remove')" class="mr-2">
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
import { baseApiUrl, showError, showSuccessMsg, formatDate, addDaysOnDate } from '@/global'
import axios from 'axios'

export default {
  name: 'Loan',
  components: { PageTitle },
  data: function() {
    return {      
      mode: 'save',
      loan: {
        loanDate: "",
        returnDate: "",
        student: {},
        book: {},
        bookNumber: ""
      },
      loans: [],
      books: [],
      students: [],
      page: 1,
      limit: 0,
      count: 0,
      fields: [
        { key: 'id', label: 'Id.', sortable: true },
        { key: 'loanDate', label: 'Emprestado em', sortable: true },
        { key: 'returnDate', label: 'Entregar em', sortable: true },
        { key: 'student.name', label: 'Aluno', sortable: true },
        { key: 'book.title', label: 'Livro', sortable: true },
        { key: 'bookNumber', label: 'Número' },
        { key: 'actions', label: 'Ações' }
      ],
      studentName: '',
      studentNameState: null
    }
  },
  methods: {
    loadLoans() {
      const url = `${baseApiUrl}/loans?status=pending&orderBy=desc&page=${this.page}`
      axios.get(url).then(res => {
        this.loans = res.data.data
        this.count = res.data.count
        this.limit = res.data.limit
        // formata as datas para: "dd/mm/aaaa"
        this.loans.map(loan => {
          loan.loanDate = new Date(`${loan.loanDate} 00:00:00`).toLocaleString().slice(0, 10)
          loan.returnDate = new Date(`${loan.returnDate} 00:00:00`).toLocaleString().slice(0, 10)
          loan.returnedAt = new Date(`${loan.returnedAt} 00:00:00`).toLocaleString().slice(0, 10)
        })
      })
    },
    setReturnDate() {
      const loanDate = new Date(`${this.loan.loanDate}      `)
      const returnDate = formatDate(addDaysOnDate(loanDate, 7))
      this.loan.returnDate = returnDate
    },
    reset() {
      this.mode = 'save'
      this.loan = {
        loanDate: formatDate(new Date()),
        returnDate: '',
        student: {},
        book: {}
      }      
      this.setReturnDate(new Date())
      this.loadLoans()
      this.$refs.loanDate.focus()
    },
    save() {
      this.loan.bookId = this.loan.book.id     
      this.loan.studentId = this.loan.student.id     
      const method = this.loan.id ? 'put' : 'post'
      const id = this.loan.id ? `/${this.loan.id}` : ''
      axios[method](`${baseApiUrl}/loans${id}`, this.loan)
        .then(res => {
          showSuccessMsg(res.data.message)
          this.reset()
        })
        .catch(showError)
    },
    remove() {
      const id = this.loan.id
      axios.delete(`${baseApiUrl}/loans/${id}`)
        .then(res => {
          showSuccessMsg(res.data.message)
          this.reset()
        })
        .catch(showError)
    },
    loadLoan(loan, mode = 'edit') {
      this.mode = mode
      axios.get(`${baseApiUrl}/loans/${loan.id}`)
        .then(res => {
          this.loan = res.data
          this.$refs.returnDate.focus();
        })
    },
    loadBooks() {
      const url = `${baseApiUrl}/books`
      axios.get(url).then(res => {
        this.books = res.data.map(book => {
          return { value: book.id, text: `${book.title} [autor: ${book.author.name}]` }
        })
      })
    },
    loadStudents() {
      const url = `${baseApiUrl}/students`
      axios.get(url).then(res => {
        this.students = res.data.map(student => {
          return { value: student.id, text: student.name }
        })
      })      
    },
    setCurrentDate() {
      let currentDate = new Date();
      let formattedDate = currentDate.toLocaleString() 
      return formattedDate
    }
  },
  mounted() {
    this.loadBooks()
    this.loadStudents()
    this.reset()    
  }
}

</script>

<style>

</style>