<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="search" label="Buscar donador por ID" @input="filtrarID"></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="donadores" :sort-by="[{ key: 'id', order: 'asc' }]">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Donadores</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn color="green" dark class="mb-2" @click="nuevoRegistro">
                Nuevo donador
              </v-btn>
              <v-btn color="red" dark class="mb-2" @click="eliminarPorID">
                Eliminar por ID
              </v-btn>
              <v-btn color="orange" dark class="mb-2" @click="editarPorID">
                Editar por ID
              </v-btn>
            </v-toolbar>
          </template>
          
          <template v-slot:no-data>
            <v-btn color="primary" @click="resetearTabla">
              Reiniciar
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="editedItem.personaId" label="ID de la persona"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="editedItem.proyectoId" label="ID del proyecto"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="editedItem.cantidadDonada" label="Cantidad donada"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue-darken-1" variant="text" @click="cerrarDialogo">
            Cancelar
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="guardarRegistro">
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEliminar" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">¿Estás seguro de borrar el donador?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="cerrarDialogoEliminar">
            Cancelar
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="eliminarConfirmar">
            Confirmar
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEliminarPorID" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Eliminar por ID</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="deleteId" label="ID del donador a eliminar"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="cerrarDialogoEliminarPorID">
            Cancelar
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="eliminarPorIDConfirmar">
            Confirmar
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEditarPorID" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Editar por ID</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editId" label="ID del donador a editar"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="cerrarDialogoEditarPorID">
            Cancelar
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="editarPorIDConfirmar">
            Confirmar
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
export default {
  data: () => ({
    search: '',
    donadores: [],
    dialog: false,
    dialogEliminar: false,
    dialogEliminarPorID: false,
    dialogEditarPorID: false,
    editId: '',
    headers: [
      { title: 'ID', align: 'start', sortable: true, key: 'id' },
      { title: 'ID Persona', key: 'PersonaId' },
      { title: 'ID Proyecto', key: 'ProyectoId' },
      { title: 'Cantidad Donada', key: 'cantidadDonada' },
    ],
    editedIndex: -1,
    editedItem: { id: null, personaId: '', proyectoId: '', cantidadDonada: '' },
    defaultItem: { id: null, personaId: '', proyectoId: '', cantidadDonada: '' },
    deleteId: '',
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Donador' : 'Editar Donador';
    },
  },

  watch: {
    dialog(val) {
      val || this.cerrarDialogo();
    },
    dialogEliminar(val) {
      val || this.cerrarDialogoEliminar();
    },
    dialogEliminarPorID(val) {
      val || this.cerrarDialogoEliminarPorID();
    },
    dialogEditarPorID(val) {
      val || this.cerrarDialogoEditarPorID();
    },
  },

  created() {
    this.mostrar();
  },

  methods: {
    async axiosRequest(url, method, data = null) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        let response;

        switch (method) {
          case 'get':
            response = await this.$axios.get(url, config);
            break;
          case 'post':
            response = await this.$axios.post(url, data, config);
            break;
          case 'put':
            response = await this.$axios.put(url, data, config);
            break;
          case 'delete':
            response = await this.$axios.delete(url, config);
            break;
          default:
            //throw new Error(`Método no disponible: ${method}`);
        }

        return response.data;
      } catch (error) {
        console.error(`Error en la solicitud ${method.toUpperCase()} a ${url}:`, error);
        throw error;
      }
    },

    async filtrarID() {
      if (this.search) {
        const searchId = parseInt(this.search);
        try {
          const response = await this.axiosRequest(`https://localhost:3001/donador/${searchId}`, 'get');
          this.donadores = response ? [response] : [];
        } catch (error) {
          console.error('Error al filtrar por ID:', error);
        }
      } else {
        this.mostrar();
      }
    },

    async mostrar() {
      try {
        const response = await this.axiosRequest('https://localhost:3001/donador/', 'get');
        this.donadores = response;
      } catch (error) {
        console.error('Error al obtener todos los donadores:', error);
      }
    },

    nuevoRegistro() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      this.dialog = true;
    },

    editarRegistro(item) {
      this.editedIndex = this.donadores.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    eliminarRegistro(item) {
      this.editedIndex = this.donadores.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogEliminar = true;
    },

    cerrarDialogo() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    cerrarDialogoEliminar() {
      this.dialogEliminar = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    eliminarConfirmar() {
      const donadorId = this.editedItem.id;
      this.axiosRequest(`https://localhost:3001/donador/${donadorId}`, 'delete')
        .then(() => {
          console.log('Donador borrado con éxito en el backend');
          this.donadores.splice(this.editedIndex, 1);
          this.cerrarDialogoEliminar();
        })
        .catch((error) => {
          console.error('Error al eliminar el donador:', error);
        });
    },

    eliminarPorID() {
      this.dialogEliminarPorID = true;
    },

    cerrarDialogoEliminarPorID() {
      this.dialogEliminarPorID = false;
      this.deleteId = '';
    },

    eliminarPorIDConfirmar() {
      const deleteId = parseInt(this.deleteId);
      this.axiosRequest(`https://localhost:3001/donador/${deleteId}`, 'delete')
        .then(() => {
          console.log('Donador borrado con éxito en el backend por ID');
          this.mostrar(); // Actualizar la lista después de la eliminación por ID
          this.cerrarDialogoEliminarPorID();
        })
        .catch((error) => {
          console.error('Error al eliminar el donador por ID:', error);
        });
    },

    editarPorID() {
      this.dialogEditarPorID = true;
    },

    cerrarDialogoEditarPorID() {
      this.dialogEditarPorID = false;
      this.editId = '';
    },

    editarPorIDConfirmar() {
      const editId = parseInt(this.editId);
      const donador = this.donadores.find((d) => d.id === editId);
      if (donador) {
        this.editedIndex = this.donadores.indexOf(donador);
        this.editedItem = Object.assign({}, donador);
        this.dialog = true;
        this.cerrarDialogoEditarPorID();
      } else {
        console.error('Donador no encontrado con el ID especificado');
      }
    },

    resetearTabla() {
      this.search = '';
      this.mostrar();
    },

    async guardarRegistro() {
  try {
    if (this.editedIndex > -1) {
      // Editar donador existente
      const response = await this.axiosRequest(`https://localhost:3001/donador/${this.editedItem.id}`, 'put', this.editedItem);
      console.log('Donador editado con éxito');
      this.donadores[this.editedIndex] = response;
    } else {
      // Insertar nuevo donador
      const response = await this.axiosRequest('https://localhost:3001/donador/', 'post', this.editedItem);
      console.log('Donador creado con éxito');
      this.donadores.push(response);
    }
    this.cerrarDialogo();
  } catch (error) {
    console.error('Error al realizar la operación:', error);
  }
},

  },
};
</script>
