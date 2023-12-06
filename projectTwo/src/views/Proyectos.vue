<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="search" label="Buscar proyecto por ID" @input="filtrarID"></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="proyectos" :sort-by="[{ key: 'id', order: 'asc' }]">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Proyectos</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn color="green" dark class="mb-2" @click="nuevoRegistro">
                Nuevo proyecto
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
                <v-text-field v-model="editedItem.nombre" label="Nombre del proyecto"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="editedItem.descripcion" label="Descripción"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="editedItem.donatarioId" label="ID del donatario"></v-text-field>
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
        <v-card-title class="text-h5">¿Estás seguro de borrar el proyecto?</v-card-title>
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
                <v-text-field v-model="deleteId" label="ID del proyecto a eliminar"></v-text-field>
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
                <v-text-field v-model="editId" label="ID del proyecto a editar"></v-text-field>
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
    proyectos: [],
    dialog: false,
    dialogEliminar: false,
    dialogEliminarPorID: false,
    dialogEditarPorID: false,
    editId: '',
    headers: [
      { title: 'ID Proyecto', align: 'start', sortable: true, key: 'idProyecto' },
      { title: 'Nombre', key: 'nombre' },
      { title: 'Descripción', key: 'descripcion' },
      { title: 'ID Donatario', key: 'donatarioId' },
    ],
    editedIndex: -1,
    editedItem: { id: null, nombre: '', descripcion: '', donatarioId: '' },
    defaultItem: { id: null, nombre: '', descripcion: '', donatarioId: '' },
    deleteId: '',
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Proyecto' : 'Editar Proyecto';
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
          const response = await this.axiosRequest(`https://localhost:3001/proyecto/${searchId}`, 'get');
          this.proyectos = response ? [response] : [];
        } catch (error) {
          console.error('Error al filtrar por ID:', error);
        }
      } else {
        this.mostrar();
      }
    },

    async mostrar() {
      try {
        const response = await this.axiosRequest('https://localhost:3001/proyecto/', 'get');
        this.proyectos = response;
      } catch (error) {
        console.error('Error al obtener todos los proyectos:', error);
      }
    },

    nuevoRegistro() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      this.dialog = true;
    },

    editarRegistro(item) {
      this.editedIndex = this.proyectos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    eliminarRegistro(item) {
      this.editedIndex = this.proyectos.indexOf(item);
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
      const projectId = this.editedItem.id;
      this.axiosRequest(`https://localhost:3001/proyecto/${projectId}`, 'delete')
        .then(() => {
          console.log('Proyecto borrado con éxito en el backend');
          this.proyectos.splice(this.editedIndex, 1);
          this.cerrarDialogoEliminar();
        })
        .catch((error) => {
          console.error('Error al eliminar el proyecto:', error);
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
      this.axiosRequest(`https://localhost:3001/proyecto/${deleteId}`, 'delete')
        .then(() => {
          console.log('Proyecto borrado con éxito en el backend por ID');
          this.mostrar(); // Actualizar la lista después de la eliminación por ID
          this.cerrarDialogoEliminarPorID();
        })
        .catch((error) => {
          console.error('Error al eliminar el proyecto por ID:', error);
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
      const proyecto = this.proyectos.find((p) => p.idProyecto === editId);
      if (proyecto) {
        this.editedIndex = this.proyectos.indexOf(proyecto);
        this.editedItem = Object.assign({}, proyecto);
        this.dialog = true;
        this.cerrarDialogoEditarPorID();
      } else {
        console.error('Proyecto no encontrado con el ID especificado');
      }
    },

    resetearTabla() {
      this.search = '';
      this.mostrar();
    },

    guardarRegistro() {
      if (this.editedIndex > -1) {
        // Editar proyecto existente
        this.axiosRequest(`https://localhost:3001/proyecto/${this.editedItem.idProyecto}`, 'put', this.editedItem)
          .then((response) => {
            console.log('Proyecto editado con éxito');
            this.proyectos[this.editedIndex] = response;
            this.cerrarDialogo();
          })
          .catch((error) => {
            console.error('Error al editar el proyecto:', error);
          });
      } else {
        // Insertar nuevo proyecto
        this.axiosRequest('https://localhost:3001/proyecto/', 'post', this.editedItem)
          .then((response) => {
            console.log('Proyecto creado con éxito');
            this.proyectos.push(response);
            this.cerrarDialogo();
          })
          .catch((error) => {
            console.error('Error al crear el nuevo proyecto:', error);
          });
      }
    },
  },
};
</script>
