<template>
  <div>
    <PageTitle icon="fas fa-file" main="Histórico do Livro"
      sub="Relatórios" />
    <div class="report">
      <b-form>
        <b-row>
          <b-col md="3" sm="6">
            <b-form-group label="Data Inicial:" label-for="initial-date">
              <b-form-input id="initial-date" type="date" v-model="initialDate" 
                v-on:blur="setReturnDate()" required autofocus autocomplete="off" 
                ref="initialDate" max="9999-12-31" 
              />
            </b-form-group>
          </b-col>
          <b-col md="3" sm="6">
            <b-form-group label="Data Final:" label-for="final-date">
              <b-form-input id="final-date" type="date" 
                v-model="finalDate" required autocomplete="off"
                ref="finalDate" max="9999-12-31" 
              />
            </b-form-group>
          </b-col>
        </b-row>
      
        <b-row>
          <b-col>
            <b-form-group label="Filtrar por Livro:" label-for="bookId">
              <b-input-group>
                <b-form-select :options="books" v-model="bookId" />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="3" sm="6">
            <b-form-group label="Número:" label-for="bookNumber">
              <b-form-input id="bookNumber" type="text"
              v-model="bookNumber" required
              placeholder="Informe o número do livro..." />
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      
      <hr>
      <b-button variant="primary"
          @click="generate">Gerar</b-button>
    </div>  
  </div>
</template>

<script>
import PageTitle from '../template/PageTitle'
import { baseApiUrl, tableReport, formatDate, addDaysOnDate } from '@/global'
import axios from 'axios'

import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {  
  name: 'ReportBookHistory',
  components: { PageTitle },
  data: function() {
    return {        
      initialDate: '',
      finalDate: '',
      bookId: null,
      bookNumber: null,
      loans: [],
      books: []
    }
  },
  methods: {
    applyFilters() {
      let filters = `?initialDate=${this.initialDate}&finalDate=${this.finalDate}`
      if (this.bookNumber!=null) filters += `&bookNumber=${this.bookNumber}`
      return filters
    },
    generate() {
      this.loans = [];
      const url = `${baseApiUrl}/books/${this.bookId}/loans` + this.applyFilters()

      axios.get(url).then(res => {
        this.loans = res.data

        // formata as datas para: "dd/mm/aaaa"
        this.loans.map(loan => {
          loan.loanDate = new Date(`${loan.loanDate} 00:00:00`).toLocaleString().slice(0, 10)
          loan.returnDate = new Date(`${loan.returnDate} 00:00:00`).toLocaleString().slice(0, 10)
          if (loan.returnedAt!=null) {
            loan.returnedAt = new Date(`${loan.returnedAt} 00:00:00`).toLocaleString().slice(0, 10)
          }
        })

        let data = this.loans;

        var dd = {
          content: [
            { 
              text: 'Histórico de Empréstimos do Livro', 
              // fontSize: 14, 
              bold: true, 
              margin: [0, 0 ,0, 10]
            },
            tableReport(
              // External data
              data,

              // Columns display order
              [
                'id', 
                'loanDate', 
                'returnedAt', 
                'book.title',
                'bookNumber',
                'student.name',
                'student.class'
              ],
              
              // Custom columns widths
              ['auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto'],
              // ['*', '*', '50%'],
              
              // Show headers?
              true,
              
              // Custom headers
              [
                {text:'Id.', fillColor: '#003153', color:'white', alignment: 'center', alignmentChild: 'right'},
                {text:'Emprestado em', fillColor: '#003153', color:'white', alignment: 'left', alignmentChild: 'left'},
                {text:'Devolvido em', fillColor: '#003153', color:'white', alignment: 'left', alignmentChild: 'left'},
                {text:'Título', fillColor: '#003153', color:'white', alignment: 'left', alignmentChild: 'left'},
                {text:'Nº', fillColor: '#003153', color:'white', alignment: 'left', alignmentChild: 'right'},
                {text:'Aluno', fillColor: '#003153', color:'white', alignment: 'left', alignmentChild: 'left'},
                {text:'Turma', fillColor: '#003153', color:'white', alignment: 'left', alignmentChild: 'left'}
              ],
              
              // Custom layout, use '' for no layout
              ''
            )
          ],
          info: {
            title: 'Histórico de Empréstimos do Livro'
          },
          styles: {
            table: {
              fontSize: 8
            }
          }
        }
        // console.log(dd)

        // create the window before the callback
        let win = window.open('', '_blank', 'autoHideMenuBar=true');
        win.moveTo(0,0);
        win.resizeTo(screen.availWidth, screen.availHeight)

        pdfMake.createPdf(dd).open({}, win);
      })
    },
    reset() {
      this.initialDate = formatDate(addDaysOnDate(new Date(), -365))
      this.finalDate = formatDate(new Date())
      this.bookNumber = null
      this.bookId = null
      this.$refs.initialDate.focus()
    },
    loadBooks() {
      const url = `${baseApiUrl}/books`
      axios.get(url).then(res => {
        const books = res.data.map(book => {
          return { value: book.id, text: `${book.title} [autor: ${book.author.name}]` }
        })
        this.books = books
      })
    },
  },
  mounted() {
    this.reset()
    this.loadBooks()
  }
}
</script>

<style>

</style>