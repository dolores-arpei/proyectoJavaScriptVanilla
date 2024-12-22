// Funciones cookies
function setCookie(cookiename, cookievalue, tiempoExpiracion) {
  let fecha = new Date();
  fecha.setTime(fecha.getTime() + (tiempoExpiracion * 24 * 60 * 60 * 1000));
  let expires = "expires=" + fecha.toUTCString();
  document.cookie = cookiename + "=" + JSON.stringify(cookievalue) + "; " + expires + "; path=/";
}

function getCookie(cookiename) {
  let name = cookiename + "=";
  let decodedCookie = document.cookie.split("; ");
  for (let i = 0; i < decodedCookie.length; i++) {
    if (decodedCookie[i].indexOf(name) == 0) {
      return JSON.parse(decodedCookie[i].substring(name.length, decodedCookie[i].length));
    }
  }
  return null;
}

// Cambia la pantalla después de 5 segundos
setTimeout(function () {
  let caja1 = document.getElementById("caja1");
  if (caja1) {
    caja1.style.display = "none";
  }
}, 5000);

// Detecta atajo de teclado para cambiar pantalla
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "F10") {
    let caja1 = document.getElementById("caja1");
    if (caja1) {
      caja1.style.display = "none";
    }
  }
});

// Valida email y redirige
document.getElementById("email").addEventListener("blur", function () {
  let emailInput = document.getElementById("email");
  let errorEmail = document.getElementById("errorEmail");
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(emailInput.value)) {
    errorEmail.style.display = "block";
  } else {
    errorEmail.style.display = "none";
  }
});

document.getElementById("email").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    let emailInput = document.getElementById("email");
    let email = emailInput.value;
    let fechaActual = new Date().toString();

    if (email) {
      let userData = { email: email, ultimoAcceso: fechaActual };
      setCookie("userData", userData, 7);
      window.location.href = "pantallaDos.html";
    }
  }
});
