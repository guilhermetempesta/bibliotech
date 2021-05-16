<template>
  <router-link :to="link" class="shortcut" style="text-decoration: none;" >
    <div class="shortcut-icon">
      <i :class="icon" :style="style"></i>
    </div> 
    <div class="shortcut-info">
      <span class="shortcut-title">{{ title }}</span>
    </div>  
  </router-link>
</template>

<script>
export default {
  name: 'Shortcut',
  props: ['title', 'path', 'icon', 'color'],
  computed: {
    style() {
      return "color: " + (this.color || "#000")
    },
    link() {
      return `${this.path}`
    }
  } 
}
</script>

<style>

  .shortcut {
    flex: 1;
    display: flex;
    border-radius: 8px;
    margin-right: 20px;
    margin-bottom: 20px;
    background-color: #FFF;
    padding: 20px;
    border: 1px solid rgba(0,0,0,0.2);
    box-shadow: 0 1px 5px rgba(0,0,0,0.15);
  }

  .shortcut-icon {
    display: flex;
    align-items: center;
  }

  .shortcut-icon i {
    font-size: 5rem;
  }

  .shortcut-info {
    flex: 1; /* componente cresce em um flex container */
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .shortcut-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
  }

</style>