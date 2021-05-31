<template>
  <div>
    <PageTitle icon="fas fa-file" main="Livros Emprestados"
      sub="Relatórios" />
    <div class="report">
      <b-form-checkbox size="sm" v-model="onlyLate"
        name="chk-only-late">
        Exibir somente devoluções em atraso
      </b-form-checkbox>
      <br>
      <b-form-group>
        <b-form-checkbox size="sm" v-model="filterDate"
          name="chk-filter-date">
          Filtrar por período
        </b-form-checkbox>
        <b-input-group-append>
          <b-form>
            <b-row>
              <b-col md="6" sm="12">
                <b-form-input :disabled="filterDate!=true" type="date" v-model="initialDate" 
                  autocomplete="off" ref="initialDate" max="9999-12-31" 
                />
              </b-col>
              <b-col md="6" sm="12">
                <b-form-input :disabled="filterDate!=true" type="date" v-model="finalDate"
                  autocomplete="off" ref="finalDate" max="9999-12-31" 
                />
              </b-col>
            </b-row>
          </b-form>
        </b-input-group-append>
      </b-form-group>
      
      <b-form-group label="Filtrar por Livro:" label-for="bookId">
        <b-input-group>
          <b-form-select :options="books" v-model="bookId" />
        </b-input-group>
      </b-form-group>

      <b-form>
        <b-row>
          <b-col md="9" sm="12">
            <b-form-group label="Filtrar por Aluno:" label-for="studentId">
              <b-input-group>
                <b-form-select :options="students" v-model="studentId" />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="3" sm="12">
            <!-- <b-form-group label="Filtrar por Turma:" label-for="student-class">
              <b-form-input id="student-class" type="text" autocomplete="off" 
                v-model="studentClass" />
            </b-form-group> -->
            <b-form-group label="Filtrar por Turma:" label-for="student-class">
              <b-input-group>
                <b-form-select id="student-class" :options="classes" v-model="studentClass" />
              </b-input-group>
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
  name: 'ReportLoanedBooks',
  components: { PageTitle },
  data: function() {
    return {        
      initialDate: '',
      finalDate: '',
      bookId: null,
      studentId: null,
      studentClass: null,
      classes: [],
      loans: [],
      books: [],
      students: [],
      onlyLate: false,
      filterDate: false
    }
  },
  methods: {
    applyFilters() {
      let filters = ''
      if (this.onlyLate==true) filters += '&onlyLate=true'
      if (this.filterDate==true) {
        filters += `&initialReturnDate=${this.initialDate}&finalReturnDate=${this.finalDate}`
      } 
      if (this.bookId!=null) filters += `&book=${this.bookId}`
      if (this.studentId!=null) filters += `&student=${this.studentId}`
      if (this.studentClass!=null) filters += `&studentClass=${this.studentClass}`
      return filters
    },
    generate() {
      this.loans = [];
      const url = `${baseApiUrl}/loans?status=pending` + this.applyFilters()

      axios.get(url).then(res => {
        this.loans = res.data

        // formata as datas para: "dd/mm/aaaa"
        this.loans.map(loan => {
          loan.loanDate = new Date(`${loan.loanDate} 00:00:00`).toLocaleString().slice(0, 10)
          loan.returnDate = new Date(`${loan.returnDate} 00:00:00`).toLocaleString().slice(0, 10)
          loan.returnedAt = new Date(`${loan.returnedAt} 00:00:00`).toLocaleString().slice(0, 10)
        })

        let data = this.loans;

        var dd = {
          content: [
            { 
              text: 'Relatório de Livros Emprestados', 
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
                'returnDate', 
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
                {text:'Devolver em', fillColor: '#003153', color:'white', alignment: 'left', alignmentChild: 'left'},
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
            title: 'Relatório de Livros Emprestados'
          },
          styles: {
            table: {
              fontSize: 8
            }
          }
        }
        // console.log(dd)

        // create the window before the callback
        pdfMake.createPdf(dd).open({}, window.open('','_blank', 'autoHideMenuBar=true'))

      })
    },
    reset() {
      this.initialDate = formatDate(addDaysOnDate(new Date(), -365))
      this.finalDate = formatDate(new Date())
      this.bookId = null
      this.studentId = null
      this.studentClass = null
      this.loans = []
      this.classes = []
      this.onlyLate = false
      this.filterDate = false
      this.$refs.initialDate.focus()
    },
    loadBooks() {
      const url = `${baseApiUrl}/books`
      axios.get(url).then(res => {
        const books = res.data.map(book => {
          return { value: book.id, text: `${book.title} [autor: ${book.author.name}]` }
        })
        const booksEmpty = [{ value: null, text: '' }]
        this.books = booksEmpty.concat(books)
      })
    },
    loadStudents() {
      const url = `${baseApiUrl}/students`
      axios.get(url).then(res => {
        const students = res.data.map(student => {
          return { value: student.id, text: `${student.name} [${student.class}]` }
        })
        const studentsEmpty = [{ value: null, text: '' }]
        this.students = studentsEmpty.concat(students)
      })
    },
    loadClasses() {
      const url = `${baseApiUrl}/students/class`
      axios.get(url).then(res => {
        const studentClasses = res.data.map(studentClass => {
          return { value: studentClass.class, text: `${studentClass.class}` }
        })
        const classesEmpty = [{ value: null, text: '' }]
        this.classes = classesEmpty.concat(studentClasses)
      })
    }
  },
  mounted() {
    this.reset()
    this.loadBooks()
    this.loadStudents()
    this.loadClasses()
  }
}
</script>

<style>

</style>