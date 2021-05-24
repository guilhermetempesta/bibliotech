<template>
  <div>
    <PageTitle icon="fas fa-key" main="Alteração de Senha"
      sub="Configurações" />
    <div class="pass">
      <b-form>
        <b-row>
          <b-col md="6" sm="6">        
            <b-form-group label="Senha atual">
              <b-input-group class="mb-2" label="Senha atual">
                <b-form-input :type="currentPasswordFieldType" autocomplete="off" autofocus
                  v-model="changePass.currentPassword" ref="currentPass" />
                <b-input-group-append is-text @click="switchVisibility('current')">
                  <b-icon :class="iconCurrentPassword"></b-icon>
                </b-input-group-append>
              </b-input-group>
            </b-form-group> 
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6" sm="6">        
            <b-form-group label="Nova senha">
              <b-input-group class="mb-2" >
                <b-form-input :type="newPasswordFieldType" autocomplete="off"
                  v-model="changePass.newPassword"/>
                <b-input-group-append is-text @click="switchVisibility('new')">
                  <b-icon :class="iconNewPassword"></b-icon>
                </b-input-group-append>
              </b-input-group>
            </b-form-group> 
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6" sm="6">        
            <b-form-group label="Confirme a nova senha">
              <b-input-group class="mb-2" >
                <b-form-input :type="confirmPasswordFieldType" autocomplete="off"
                    v-model="changePass.confirmPassword"/>
                <b-input-group-append is-text @click="switchVisibility('confirm')">
                  <b-icon :class="iconConfirmPassword"></b-icon>
                </b-input-group-append>
              </b-input-group>
            </b-form-group> 
          </b-col>
        </b-row>
        <b-button variant="primary" 
          @click="save">Salvar</b-button>
        <b-button class="ml-2" 
          @click="reset" >Cancelar</b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
import PageTitle from '../template/PageTitle'
import { baseApiUrl, showError, showSuccessMsg } from '@/global'
import axios from 'axios'

export default {
  name: 'Loan',
  components: { PageTitle },
  data: function() {
    return {
      currentPasswordFieldType: "password",
      newPasswordFieldType: "password",
      confirmPasswordFieldType: "password",
      iconCurrentPassword: "far fa-eye",
      iconNewPassword: "far fa-eye",
      iconConfirmPassword: "far fa-eye",
      changePass: {  
        currentPassword: '', 
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    reset() {
      this.changePass = {  
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      this.$refs.currentPass.focus()
    },
    save() { 
      console.log(this.changePass)
      axios.patch(`${baseApiUrl}/change-password`, this.changePass)
        .then(res => {
          showSuccessMsg(res.data.message)
          this.reset()
        })
        .catch(showError)
    },
    switchVisibility(field) {
      if (field==='current') {
        this.currentPasswordFieldType = this.currentPasswordFieldType === "password" ? "text" : "password";
        this.iconCurrentPassword = this.iconCurrentPassword === "far fa-eye" ? "far fa-eye-slash" : "far fa-eye"
      }
      if (field==='new') {
        this.newPasswordFieldType = this.newPasswordFieldType === "password" ? "text" : "password";
        this.iconNewPassword = this.iconNewPassword === "far fa-eye" ? "far fa-eye-slash" : "far fa-eye"
      }
      if (field==='confirm') {
        this.confirmPasswordFieldType = this.confirmPasswordFieldType === "password" ? "text" : "password";
        this.iconConfirmPassword = this.iconConfirmPassword === "far fa-eye" ? "far fa-eye-slash" : "far fa-eye"
      }
    }
  }
}
</script>

<style>

</style>