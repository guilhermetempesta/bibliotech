<template>
  <div>
    <PageTitle icon="fas fa-file" main="Livros"
      sub="Relatórios" />
    <div class="report">
            
      <b-form-group label="Filtrar por Autor:" label-for="authorId">
        <b-input-group>
          <b-form-select :options="authors" v-model="authorId" />
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
  name: 'ReportBooks',
  components: { PageTitle },
  data: function() {
    return {        
      bookId: null,
      books: [],
      authors: [],
      orderBy: {
        selected: 0,
        options: [
          { text: 'Título', value: 0 },
          { text: 'Autor', value: 1 },
          { text: 'Localização', value: 2 }
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
      if (this.authorId!=null) filters += `&author=${this.authorId}`
      return filters
    },
    generate() {
      this.books = [];
      const url = `${baseApiUrl}/books` + this.applyOrdernation() + this.applyFilters()

      axios.get(url).then(res => {
        this.books = res.data;

        var dd = {
          content: [
            { 
              text: 'Relatório de Livros Emprestados', 
              bold: true, 
              margin: [0, 0 ,0, 10]
            },
            tableReport(
              // External data
              this.books,

              // Columns display order
              [ 'id', 'code', 'title', 'author.name', 'publisher', 'localization' ],
              
              // Custom columns widths
              ['auto', 'auto', '*', 'auto', 'auto', 'auto'],
              
              // Show headers?
              true,
              
              // Custom headers
              [
                {text:'Id.', fillColor: '#003153', color:'white', alignment: 'center', alignmentChild: 'right'},
                {text:'Código', fillColor: '#003153', color:'white', alignment: 'left', alignmentChild: 'left'},
                {text:'Título', fillColor: '#003153', color:'white', alignment: 'left', alignmentChild: 'left'},
                {text:'Autor', fillColor: '#003153', color:'white', alignment: 'left', alignmentChild: 'left'},
                {text:'Editora', fillColor: '#003153', color:'white', alignment: 'left', alignmentChild: 'left'},
                {text:'Localização', fillColor: '#003153', color:'white', alignment: 'left', alignmentChild: 'left'}
              ],
              
              // Custom layout, use '' for no layout
              ''
            )
          ],
          info: {
            title: 'Relatório de Livros'
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
      this.bookId = null,
      this.books = []
    },
    loadAuthors() {
      const url = `${baseApiUrl}/authors`
      axios.get(url).then(res => {
        const authors = res.data.map(author => {
          return { value: author.id, text: `${author.name}` }
        })
        const authorsEmpty = [{ value: null, text: '' }]
        this.authors = authorsEmpty.concat(authors)
      })
    }
  },
  mounted() {
    this.reset()
    this.loadAuthors()
  }
}
</script>

<style>

</style>