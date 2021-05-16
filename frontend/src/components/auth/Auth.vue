<template>
  <div class="auth-content">
    <div class="auth-modal">
      <img src="@/assets/logo.png" width="200" alt="Logo">
      <hr>
      <div class="auth-title">Login</div>
      <input v-model="user.username" name="username" type="text" placeholder="Usuário">
      <input v-model="user.password" name="password" type="password" placeholder="Senha">
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
    background-color: #FFF;
    width: 350px;
    padding: 35px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
    
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

  .auth-modal input {
    border: 1px solid #BBB;
    width: 100%;
    margin-bottom: 15px;
    padding: 3px 8px;
    outline: none;
  }

  .auth-modal button {
    align-self: flex-end;
    background-color: #2460ae;
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
  
</style>