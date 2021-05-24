<template>
  <div class="auth-content">
    <div class="auth-modal">
      <img src="@/assets/logo_side_invert.png" width="200" alt="Logo">
      <hr>
      <b-input-group class="mb-2">
        <b-input-group-prepend is-text>
          <b-icon class="fas fa-user" id="auth-icon"></b-icon>
        </b-input-group-prepend>
        <b-form-input v-model="user.username" name="username" autofocus
          type="text" placeholder="Usuário" autocomplete="off"/>
      </b-input-group>
      <b-input-group class="mb-2">
        <b-input-group-prepend is-text>
          <b-icon class="fas fa-key" id="auth-icon"></b-icon>
        </b-input-group-prepend>
        <b-form-input v-model="user.password" name="password" 
          type="password" placeholder="Senha"/>
      </b-input-group>
      <b-button @click="signin">Entrar</b-button>
    </div>
  </div>  
</template>

<script>
import { baseApiUrl, showError, userKey, decodeToken } from '@/global'
import axios from 'axios'

export default {
  name: 'Auth',
  data: function() {
    return {
      user: {}
    }
  },
  methods: {
    reset() {
      this.user = {}
    },
    signin() {
      axios.post(`${baseApiUrl}/login`, this.user)
        .then(res => {
          // decodificar token
          const data = decodeToken(res.headers['authorization'])
          data.token = res.headers['authorization']
          // setar usuario na store
          this.$store.commit('setUser', data)
          // setar dados do usuario no localStorage
          localStorage.setItem(userKey, JSON.stringify(data))
          // ir para a dashboard
          this.$router.push({ path: '/' })
        })
        .catch(showError)
    }
  }
}
</script>

<style>
  .auth-content{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .auth-modal {
    background-color: #003153;
    /* background-color: #FFF; */
    width: 350px;
    padding: 35px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
    border-radius: 10px;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .auth-title {
    font-size: 1.5rem;
    font-weight: 100;
    margin-top: 10px;
    margin-bottom: 15px;
  }

  .auth-modal button {
    align-self: flex-end;
    /* background-color: #2460ae;
    color: #FFF; */
    background-color: #376B8C;
    color: #FFF;
    padding: 5px 15px;
  }

  .auth-modal hr {
    border: 0;
    width: 100%;
    height: 1px;
    background-image: linear-gradient(to right,
      rgba(120,120,120,0), 
      rgba(120,120,120,0.75), 
      rgba(120,120,120,0) 
    );
  }

  #auth-icon {
    width: 15px;
  }
  
</style>