<template>
  <div>
    <PageTitle icon="fa fa-graduation-cap" main="Cadastro de Alunos"
      sub="Cadastros" />
    <div class="student">
      <b-form>
        <input id="student-id" type="hidden" v-model="student.id" />      
        <b-form-group label="Nome:" label-for="student-name">
          <b-form-input id="student-name" type="text" ref="studentName"
            v-model="student.name" required
            :readonly="mode==='remove'"
            placeholder="Informe o nome..." />
        </b-form-group>
        <b-row>
          <b-col md="6" sm="12">
            <b-form-group label="Telefone:" label-for="student-phone">
              <b-form-input id="student-phone" type="text"
                v-model="student.phone" required
                :readonly="mode==='remove'"
                placeholder="Informe o telefone..." />
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group label="Turma:" label-for="student-class">
              <b-form-input id="student-class" type="text"
                v-model="student.class" required
                :readonly="mode==='remove'"
                placeholder="Informe a turma..." />
            </b-form-group>
          </b-col>
        </b-row>    
        <b-form-group label="Observações:" label-for="student-comments">
          <b-form-input id="student-comments" type="text"
            v-model="student.comments" required
            :readonly="mode==='remove'"
            placeholder="..." />
        </b-form-group> 
        <b-button variant="primary" v-if="mode!='remove'" 
          @click="save">Salvar</b-button>
        <b-button variant="danger" v-if="mode==='remove'" 
          @click="remove">Excluir</b-button>
        <b-button class="ml-2" 
          @click="reset" >Cancelar</b-button>       
      </b-form>
      <hr>
      <b-table hover striped :items="students" :fields="fields">
        <template slot="cell(actions)" slot-scope="data">
          <b-button size="sm" variant="warning" @click="loadStudent(data.item)" class="mr-2">
            <i class="fa fa-pencil"></i>
          </b-button>
          <b-button size="sm" variant="danger" @click="loadStudent(data.item, 'remove')" class="mr-2">
            <i class="fa fa-trash"></i>
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
  name: 'Student',
  components: { PageTitle },
  data: function() {
    return {
      mode: 'save',
      student: {
        name: "",
        phone: "",
        class: "",
        comments: ""
      },
      students: [],
      page: 1,
      limit: 0,
      count: 0,
      fields: [
        { key: 'id', label: 'Código', sortable: true },
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'phone', label: 'Telefone', sortable: true },
        { key: 'class', label: 'Turma', sortable: true },
        { key: 'comments', label: 'Observação', sortable: true },
        { key: 'actions', label: 'Ações' }
      ]
    }
  },
  methods: {
    loadStudents() {
      const url = `${baseApiUrl}/students?page=${this.page}`
      axios.get(url).then(res => {
        this.count = res.data.count
        this.limit = res.data.limit
        this.students = res.data.data
        this.students = res.data.data.map(student => {
          return { ...student, value: student.id }
        })
      })
    },
    reset() {
      this.mode = 'save'
      this.student = {}
      this.loadStudents()
    },
    save() {
      const method = this.student.id ? 'put' : 'post'
      const id = this.student.id ? `/${this.student.id}` : ''
      axios[method](`${baseApiUrl}/students${id}`, this.student)
        .then(res => {
          showSuccessMsg(res.data.message)
          this.reset()
        })
        .catch(showError)
    },
    remove() {
      const id = this.student.id
      axios.delete(`${baseApiUrl}/students/${id}`)
        .then(res => {
          showSuccessMsg(res.data.message)
          this.reset()
        })
        .catch(showError)
    },
    loadStudent(student, mode = 'edit') {
      this.mode = mode
      this.student = { ...student }
      this.$refs.studentName.focus();
    }
  },
  watch: {
    page() {
      this.loadStudents()
    }
  },
  mounted() {
    this.loadStudents()
  }
}
</script>

<style>

</style>