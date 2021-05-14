<template>
  <div class="user-admin">
    <b-form>
      <input id="user-id" type="hidden" v-model="user.id" />
      <b-row>
        <b-col md="3" sm="6">
          <b-form-group label="Nome completo:" label-for="user-full-name">
            <b-form-input id="user-full-name" type="text"
              v-model="user.name" required
              :readonly="mode==='remove'"
              placeholder="Informe o nome completo..." />
            </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group label="Nome de usuário:" label-for="user-username">
            <b-form-input id="user-username" type="text"
              v-model="user.username" required
              :readonly="mode!='save'"
              placeholder="Informe o nome de usuário..." />
            </b-form-group>
        </b-col>
      </b-row>
      <b-row>          
      </b-row>
      <b-form-checkbox id="user-admin" v-model="checked" v-show="mode!='remove'" class="mt-3 mb-3">
        Administrador?
      </b-form-checkbox>
      <b-row v-show="mode==='save'">
        <b-col md="6" sm="12">
          <b-form-group label="Senha:" label-for="user-password">
            <b-form-input id="user-password" type="password"
              v-model="user.password" required
              placeholder="Informe a senha do usuário..." />
            </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group label="Confirmação de senha:" label-for="user-confirm-password">
            <b-form-input id="user-confirm-password" type="password"
              v-model="user.confirmPassword" required
              placeholder="Confirme a senha do usuário..." />
            </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col xs="12">
          <b-button variant="primary" v-if="mode!='remove'" 
            @click="save">Salvar</b-button>
          <b-button variant="danger" v-if="mode==='remove'" 
            @click="remove">Excluir</b-button>
          <b-button class="ml-2" 
            @click="reset" >Cancelar</b-button>
        </b-col>
      </b-row>
    </b-form>
    <hr>
    <b-table responsive hover striped :items="users" :fields="fields">      
      <template slot="cell(actions)" slot-scope="data">
        <b-button variant="warning" @click="loadUser(data.item)" class="mr-2">
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button variant="danger" @click="loadUser(data.item, 'remove')" class="mr-2">
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
    </b-table>
  </div>
</template>


<script>
import { baseApiUrl, showError, showSuccessMsg } from '@/global'
import axios from 'axios'

export default {  
  name: 'UserAdmin',
  data: function() {
    return {
      mode: 'save',
      user: {
        name: "",
        username: "",
        password: "",
        confirmPassword: "",
        admin: false
      },
      users: [],
      checked: false,
      fields: [
        { key: 'id', label: 'Código', sortable: true },
        { key: 'name', label: 'Nome completo', sortable: true },
        { key: 'username', label: 'Nome de usuário', sortable: true },
        { key: 'admin', label: 'Administrador', sortable: true ,
          formatter: value => (value===true) ? 'Sim' : 'Não' },
        { key: 'actions', label: 'Ações' }
      ]
    }
  },
  methods: {
    loadUsers() {
      const url = `${baseApiUrl}/users`
      axios.get(url).then(res => {
        this.users = res.data
      })
    },
    reset() {
      this.mode = 'save'
      this.checked = false
      this.user = {}
      this.loadUsers()
    },
    save() {
      this.user.admin = this.checked
      const method = this.user.id ? 'put' : 'post'
      const id = this.user.id ? `/${this.user.id}` : ''
      axios[method](`${baseApiUrl}/users${id}`, this.user)
        .then(res => {
          showSuccessMsg(res.data.message)
          this.reset()
        })
        .catch(showError)
    },
    remove() {
      const id = this.user.id
      axios.delete(`${baseApiUrl}/users/${id}`)
        .then(res => {
          showSuccessMsg(res.data.message)
          this.reset()
        })
        .catch(showError)
    },
    loadUser(user, mode = 'edit') {
      this.mode = mode
      this.user = { ...user }
      this.checked = this.user.admin

    }
  },
  mounted() {
    this.loadUsers()
  }
}
</script>

<style>

</style>