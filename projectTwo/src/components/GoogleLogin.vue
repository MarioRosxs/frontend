<template>
  <div ref="googleLoginBtn" class="btn_google"></div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const googleLoginBtn = ref(null);

onMounted(() => {
  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_ID_CLIENT_GOOGLE,
    callback: onSuccess,
    context: "signin",
    auto_select: true,
    scope: process.env.VUE_APP_GOOGLE_SCOPES,
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },
  });
  window.google.accounts.id.renderButton(googleLoginBtn.value, {
    text: "signin_with", // or 'signup_with' | 'continue_with' | 'signin'
    size: "large", // or 'small' | 'medium'
    width: "366", // max width 400
    theme: "outline", // or 'filled_black' |  'filled_blue'
    logo_alignment: "center", // or 'center'
  });
});

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
}

/*
function onSuccess(googleUser) {
    
    const user = parseJwt(googleUser.credential)
    console.log(user);
    console.log(user.email);
    //console.log("inicio sesion");
     /*const name = user.name
    const imgURL = user.picture
    const email = user.email
    const id_token = googleUser.credential* 
    router.push("/menu");
   
}
*/
function onSuccess(googleUser) {
  const user = parseJwt(googleUser.credential);
  const email = user.email;
  const name = user.name;
  const imgURL = user.picture;

  console.log("Inicio de sesión exitoso");

  // Enviar el email al backend
  console.log("Correo electrónico enviado al backend:", email);
  axios
    .post("https://localhost:3001/login", { email }, { withCredentials: true })
    .then((response) => {
      if (response.data.error) {
        console.log("Error en el backend:", response.data.error);
      } else {
        const decodificadoToken = response.data.token;
        console.log(decodificadoToken);
        localStorage.setItem("token", decodificadoToken);
       localStorage.setItem("user", JSON.stringify({ email, name, imgURL }));
        if (decodificadoToken === "SINACCESO") {
          router.push("/home");
        } else {
          router.push("/personas");
        }

        // Realizar acciones adicionales si es necesario
      }
    })
    .catch((error) => {
      console.error("Error en Axios:", error);
    });
}
</script>
<style>
.btn_google {
  display: flex;
  justify-content: center;
}
</style>
