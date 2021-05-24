<template>
  <div>
    <PageTitle icon="fa fa-cogs" main="Administração do Sistema"
      sub="Configurações" />
    <div class="admin-pages-tabs">
      <b-card no-body>
        <b-tabs card>
          <b-tab title="Cadastrar Usuários" active>
            <UserAdmin />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import PageTitle from '../template/PageTitle'
import UserAdmin from './UserAdmin'

export default {
  name: 'AdminPages',
  components: { PageTitle, UserAdmin }
}
</script>

<style>

</style>