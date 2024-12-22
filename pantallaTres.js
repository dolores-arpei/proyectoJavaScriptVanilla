// Manejo de cookies
function setCookie(cookiename, cookievalue, tiempoExpiracion) {
  const fecha = new Date();
  fecha.setTime(fecha.getTime() + tiempoExpiracion * 24 * 60 * 60 * 1000);
  const expires = "expires=" + fecha.toUTCString();
  document.cookie = `${cookiename}=${JSON.stringify(cookievalue)}; ${expires}; path=/`;
}

function getCookie(cookiename) {
  const name = `${cookiename}=`;
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    if (cookie.indexOf(name) === 0) {
      return JSON.parse(cookie.substring(name.length));
    }
  }
  return [];
}

// Variables
const preguntaInput = document.getElementById("pregunta");
const respuestaRadios = document.getElementsByName("respuesta");
const puntuacionInput = document.getElementById("puntuacion");
const btnGrabar = document.getElementById("btnGrabar");
const mensajeCarga = document.getElementById("mensajeCarga");
const tablaPreguntas = document.getElementById("tablaPreguntas");
const tbody = tablaPreguntas.querySelector("tbody");

// Valida campos y habilita botón "Grabar"
function validarFormulario() {
  const pregunta = preguntaInput.value;
  const respuesta = [...respuestaRadios].some((radio) => radio.checked);
  const puntuacion = /^[0-9]$/.test(puntuacionInput.value);

  btnGrabar.disabled = !(pregunta && respuesta && puntuacion);
}

// Escucha eventos de formulario
preguntaInput.addEventListener("input", validarFormulario);
respuestaRadios.forEach((radio) => radio.addEventListener("change", validarFormulario));
puntuacionInput.addEventListener("input", (e) => {
  // Permite solo números
  if (!/^[0-9]$/.test(e.data)) {
    puntuacionInput.value = puntuacionInput.value.replace(/[^0-9]/g, "");
  }
  validarFormulario();
});

// Guarda las pregunta en las cookies y actualiza la tabla
function grabarPregunta() {
  const pregunta = preguntaInput.value;
  const respuesta = [...respuestaRadios].find((radio) => radio.checked).value;
  const puntuacion = puntuacionInput.value;

  const nuevaPregunta = {
    pregunta,
    respuesta,
    puntuacion,
    estado: "Guardando...",
  };

  // Obtiene las preguntas existentes en cookies
  const preguntas = getCookie("preguntas") || [];
  preguntas.push(nuevaPregunta);

  // Guarda la nueva lista en las cookies
  setCookie("preguntas", preguntas, 7);

  // Limpia el formulario
  limpiarFormulario();

  // Muestra las preguntas actualizadas en la tabla
  mostrarPreguntas(preguntas);

  // Simula un retraso para cambiar el estado a "OK"
  setTimeout(() => {
    nuevaPregunta.estado = "OK";
    setCookie("preguntas", preguntas, 7); // Actualiza la cookie con el estado actualizado
    mostrarPreguntas(preguntas); // Actualiza la tabla
  }, 5000); // 5 segundos de retraso
}

// Limpia el formulario después de grabar
function limpiarFormulario() {
  preguntaInput.value = "";
  respuestaRadios.forEach((radio) => (radio.checked = false));
  puntuacionInput.value = "";
  btnGrabar.disabled = true;
}

// Carga las preguntas al inicio
function cargarPreguntas(retraso = false) {
  const preguntas = getCookie("preguntas") || [];
  if (retraso) {
    setTimeout(() => mostrarPreguntas(preguntas), 5000);
  } else {
    mostrarPreguntas(preguntas);
  }
}

// Muestra las preguntas en la tabla
function mostrarPreguntas(preguntas) {
  mensajeCarga.style.display = "none";
  tablaPreguntas.style.display = "table";
  tbody.innerHTML = ""; // Limpia la tabla

  preguntas.forEach(({ pregunta, respuesta, puntuacion, estado }) => {
    const row = `<tr>
      <td>${pregunta}</td>
      <td>${respuesta}</td>
      <td>${puntuacion}</td>
      <td>${estado}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

// Eventos iniciales
btnGrabar.addEventListener("click", grabarPregunta);
cargarPreguntas(false); // Carga preguntas al cargar la página
