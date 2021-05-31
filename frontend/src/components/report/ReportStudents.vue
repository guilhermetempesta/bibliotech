<template>
  <div>
    <PageTitle icon="fas fa-file" main="Alunos"
      sub="Relatórios" />
    <div class="report">
            
      <b-form-group label="Filtrar por Turma:" label-for="studentClass">
        <b-input-group>
          <b-form-select :options="classes" v-model="studentClass" />
        </b-input-group>
      </b-form-group>

      <b-form-group label="Selecione a ordenação" v-slot="{ ariaDescribedby }">
        <b-form-radio-group
          id="radio-group"
          v-model="orderBy.selected"
          :options="orderBy.options"
          :aria-describedby="ariaDescribedby"
          name="radio-options"
        ></b-form-radio-group>
      </b-form-group>

      <hr>
      <b-button variant="primary"
          @click="generate">Gerar</b-button>
    </div>  
  </div>
</template>

<script>
import PageTitle from '../template/PageTitle'
import { baseApiUrl, tableReport } from '@/global'
import axios from 'axios'

import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {  
  name: 'ReportStudents',
  components: { PageTitle },
  data: function() {
    return {        
      studentClass: null,
      classes: [],
      students: [],
      orderBy: {
        selected: 0,
        options: [
          { text: 'Nome', value: 0 },
          { text: 'Turma', value: 1 }
        ]
      }
    }
  },
  methods: {
    applyOrdernation() {
      return `?orderBy=${this.orderBy.selected}`
    },
    applyFilters() {
      let filters = ''
      if (this.studentClass!=null) filters += `&studentClass=${this.studentClass}`
      return filters
    },
    generate() {
      this.students = [];
      const url = `${baseApiUrl}/students` + this.applyOrdernation() + this.applyFilters()

      axios.get(url).then(res => {
        this.students = res.data;

        var dd = {
          content: [
            { 
              text: 'Relatório de Alunos', 
              bold: true, 
              margin: [0, 0 ,0, 10]
            },
            tableReport(
              // External data
              this.students,

              // Columns display order
              [ 'id', 'name', 'class', 'phone' ],
              
              // Custom columns widths
              ['auto', '*', 'auto', 'auto'],
              
              // Show headers?
              true,
              
              // Custom headers
              [
                {text:'Id.', fillColor: '#003153', color:'white', alignment: 'center', alignmentChild: 'right'},
                {text:'Nome', fillColor: '#003153', color:'white', alignment: 'left', alignmentChild: 'left'},
                {text:'Turma', fillColor: '#003153', color:'white', alignment: 'left', alignmentChild: 'left'},
                {text:'Telefone', fillColor: '#003153', color:'white', alignment: 'left', alignmentChild: 'left'}
              ],
              
              // Custom layout, use '' for no layout
              ''
            )
          ],
          info: {
            title: 'Relatório de Alunos'
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
      this.studentClass = null,
      this.classes = []
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
    this.loadClasses()
  }
}
</script>

<style>

</style>