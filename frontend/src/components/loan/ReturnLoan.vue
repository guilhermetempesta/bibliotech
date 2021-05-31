<template>
  <div>
    <PageTitle icon="fas fa-undo" main="Registro de Devoluções"
      sub="Empréstimo" />
    <b-card no-body>
      <b-tabs pills card>
        <b-tab title="Pendentes" active>
          <b-card-text>
            <div class="loan">              
              <b-table hover striped :items="pendingLoans" :fields="fieldsPending">
                <template slot="cell(actions)" slot-scope="data">
                  <b-button variant="success" @click="confirmSave(data.item)"
                    class="mr-2">
                    <i id="loan-icon" class="fas fa-check"></i>
                  </b-button>
                </template>
              </b-table>
              <b-pagination align="center" size="md" v-model="page" :total-rows="count" :per-page="limit" />
            </div>
          </b-card-text>
        </b-tab>
        <b-tab title="Finalizadas">
          <b-card-text>
            <div class="loan">              
              <b-table hover striped :items="finishedLoans" :fields="fieldsFinished">
                <template slot="cell(actions)" slot-scope="data">
                  <b-button variant="danger" @click="confirmCancel(data.item)" 
                    class="mr-2">
                    <i id="loan-icon" class="fa fa-times"></i>
                  </b-button>
                </template>
              </b-table>
              <b-pagination align="center" size="md" v-model="page" :total-rows="count" :per-page="limit" />
            </div>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>  
</template>

<script>
import PageTitle from '../template/PageTitle'
import { baseApiUrl, showError, showSuccessMsg, formatDate } from '@/global'
import axios from 'axios'

export default {
  name: 'ReturnLoan',
  components: { PageTitle },
  data: function() {
    return {   
      modalResult: false,
      returnLoan: {
        date: formatDate(new Date()),
        loanId: 0
      },
      pendingLoans: [],
      finishedLoans: [],
      books: [],
      students: [],
      page: 1,
      limit: 0,
      count: 0,
      fieldsPending: [
        { key: 'id', label: 'Id.', sortable: true },
        { key: 'loanDate', label: 'Emprestado em', sortable: true },
        { key: 'returnDate', label: 'Devolver em', sortable: true },
        { key: 'student.name', label: 'Aluno', sortable: true },
        { key: 'book.title', label: 'Livro', sortable: true },
        { key: 'bookNumber', label: 'Número' },
        { key: 'actions', label: 'Ações' }
      ],
      fieldsFinished: [
        { key: 'id', label: 'Id.', sortable: true },
        { key: 'loanDate', label: 'Emprestado em', sortable: true },
        { key: 'returnedAt', label: 'Devolvido em', sortable: true },
        { key: 'student.name', label: 'Aluno', sortable: true },
        { key: 'book.title', label: 'Livro', sortable: true },
        { key: 'bookNumber', label: 'Número' },
        { key: 'actions', label: 'Ações' }
      ]
    }
  },
  methods: {
    loadPendingLoans() {      
      const url = `${baseApiUrl}/loans?status=pending&orderBy=desc&page=${this.page}`
      axios.get(url).then(res => {
        this.pendingLoans = res.data.data
        this.count = res.data.count
        this.limit = res.data.limit
        // formata as datas para: "dd/mm/aaaa"
        this.pendingLoans.map(loan => {
          loan.loanDate = new Date(`${loan.loanDate} 00:00:00`).toLocaleString().slice(0, 10)
          loan.returnDate = new Date(`${loan.returnDate} 00:00:00`).toLocaleString().slice(0, 10)
          loan.returnedAt = new Date(`${loan.returnedAt} 00:00:00`).toLocaleString().slice(0, 10)
        })
      })
    },
    loadFinishedLoans() {      
      const url = `${baseApiUrl}/loans?status=finished&orderBy=desc&page=${this.page}`
      axios.get(url).then(res => {
        this.finishedLoans = res.data.data
        this.count = res.data.count
        this.limit = res.data.limit
        // formata as datas para: "dd/mm/aaaa"
        this.finishedLoans.map(loan => {
          loan.loanDate = new Date(`${loan.loanDate} 00:00:00`).toLocaleString().slice(0, 10)
          loan.returnDate = new Date(`${loan.returnDate} 00:00:00`).toLocaleString().slice(0, 10)
          loan.returnedAt = new Date(`${loan.returnedAt} 00:00:00`).toLocaleString().slice(0, 10)
        })
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
    reset() {
      this.returnLoan = {
        date: formatDate(new Date()),
        loanId: 0
      } 
      this.loadPendingLoans()
      this.loadFinishedLoans()
    },
    confirmSave(loan) {
      this.$bvModal.msgBoxConfirm('Deseja confirmar a devolução?', {
        title: 'Confirmação',
        okVariant: 'danger',
        okTitle: 'Sim',
        cancelTitle: 'Não',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: false
      })
      .then(value => {
        if (value) this.save(loan)
      })
    },
    save(loan) {
      this.returnLoan.loanId = loan.id
      axios.patch(`${baseApiUrl}/return-loan`, this.returnLoan)
        .then(res => {
          showSuccessMsg(res.data.message)
          this.reset()
        })
        .catch(showError)
    },
    confirmCancel(loan) {
      this.$bvModal.msgBoxConfirm('Deseja cancelar a devolução?', {
        title: 'Confirmação',
        okVariant: 'danger',
        okTitle: 'Sim',
        cancelTitle: 'Não',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: false
      })
      .then(value => {
        if (value) this.cancel(loan)
      })
    },
    cancel(loan) {
      axios.patch(`${baseApiUrl}/cancel-return/${loan.id}`)
        .then(res => {
          showSuccessMsg(res.data.message)
          this.reset()
        })
        .catch(showError)
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