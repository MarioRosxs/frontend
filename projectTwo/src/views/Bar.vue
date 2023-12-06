<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        app
        permanent
        width="250"
      >
        <!-- Contenido del menú -->
        <v-list>
          <v-list-item
            :prepend-avatar="getUserAvatar()"
            :title="getUserName()"
            :subtitle="getUserEmail()"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list dense nav>
          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            :prepend-icon="item.icon"
            :title="item.title"
            @click="handleMenuItemClick(item)"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <!-- Tu contenido principal aquí -->
        <v-container>
          <!-- Agrega aquí el contenido específico de tu vista -->
          <!-- Pueden ser tus componentes, rutas, etc. -->
          <router-view v-if="showContentView"></router-view>
          <!-- Agrega aquí el botón u otro contenido que desees mostrar siempre -->
          
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  data() {
    
    return {
      menuItems: [
        { title: "Personas", icon: "mdi-table", route: "personas" },
        { title: "Proyectos", icon: "mdi-table", route: "proyectos" },
        { title: "Donadores", icon: "mdi-table", route: "donadores" },
        { title: "Cerrar Sesión", icon: "mdi-logout", route: "" },
      ],
      showContentView: true, // Variable para controlar la visibilidad del contenido principal
    };
  },
  methods: {
    navigateTo(routeName) {
      // Redirige al usuario a la página correspondiente
      this.$router.push(routeName);
    },
    handleMenuItemClick(item) {
      // Manejar clic en el elemento del menú
      if (item.title === "Cerrar Sesión") {
        this.logout();
      } else {
        this.navigateTo(item.route);
      }
    },
    logout() {
      // Lógica para cerrar sesión
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.$router.push("/");
    },
    getUserAvatar() {
  const token = localStorage.getItem("token");
  // Verifica el estado del token
  if (token && token !== "SINACCESO") {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.imgURL;
  }
  // Si el token indica "sin acceso" o no está definido, devuelve null o una imagen predeterminada
  return null;
},

getUserName() {
  const token = localStorage.getItem("token");
  if (token && token !== "SINACCESO") {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.name ? user.name : "Nombre Predeterminado";
  }
  // Si el token indica "sin acceso" o no está definido, devuelve un nombre predeterminado
  return "Nombre Predeterminado";
},

getUserEmail() {
  const token = localStorage.getItem("token");
  if (token && token !== "SINACCESO") {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.email ? user.email : "correo@ejemplo.com";
  }
  // Si el token indica "sin acceso" o no está definido, devuelve un correo predeterminado
  return "correo@ejemplo.com";
},
  },
};
</script>

<style>
/* Puedes agregar estilos específicos si es necesario */
</style>
