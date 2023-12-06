<template>
  <v-container class="error-container" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="error-card" elevation="12">
          <v-card-title class="error-title">Acceso No Autorizado</v-card-title>
          <v-card-text>
            <p>{{ errorMessage }}</p>
          </v-card-text>
          <v-card-actions>
            <router-link to="/">
              <v-btn color="primary" dark>Ir a la página de inicio</v-btn>
            </router-link>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      errorMessage: "Lo siento, no estás autorizado para acceder a esta página. Por favor, inicia sesión.",
    };
  },
};
</script>

<style scoped>
.error-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-card {
  max-width: 400px;
  width: 100%;
  text-align: center;
  padding: 20px;
}

.error-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 15px;
}

/* Estilos adicionales si es necesario */
</style>
