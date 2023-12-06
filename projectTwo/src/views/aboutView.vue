<template>
  <v-navigation-drawer app permanent width="250">
    <!-- Contenido del menú -->
    <v-list>
      <v-list-item
        :prepend-avatar="userData.picture"
        :title="userData.name"
        :subtitle="userData.email"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :title="item.title"
        @click="navigateTo(item.route)"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const userData = ref({
  name: 'Nombre de Usuario',
  email: 'usuario@example.com',
  picture: '~@/assets/avatar.png',
});

const menuItems = ref([
  { title: 'Principal', icon: 'mdi-home', route: 'home' },
  { title: 'Tabla', icon: 'mdi-table', route: 'tabla' },
  { title: 'Imagen', icon: 'mdi-image', route: 'imagen' },
]);

onMounted(() => {
  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_ID_CLIENT_GOOGLE,
    callback: onSuccess,
    context: 'signin',
    auto_select: false,
    scope: process.env.VUE_APP_GOOGLE_SCOPES,
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
  });
  // Resto del código...
});

function onSuccess(googleUser) {
  const basicProfile = googleUser.getBasicProfile();

  userData.value = {
    name: basicProfile.getName(),
    email: basicProfile.getEmail(),
    picture: basicProfile.getImageUrl(),
  };

  router.push('/menu');
}

function navigateTo(routeName) {
  // Redirige al usuario a la página correspondiente
  router.push(routeName);
}
</script>
