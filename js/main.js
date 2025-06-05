const loginForm = document.getElementById("login-form");
const loginSection = document.getElementById("login-section");
const mainSection = document.getElementById("main-section");
const contenedor = document.getElementById("data-container");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const tituloSeccion = document.getElementById("titulo-seccion");
const formularioSection = document.getElementById("formulario-section");
const formularioGenerico = document.getElementById("formulario-generico");
const formTitle = document.getElementById("form-title");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (email === "" || password === "") return alert("Por favor completa todos los campos.");

  const response = await fetch("https://fakestoreapi.com/auth/login", {
    method: "POST",
    body: JSON.stringify({ username: email, password: password }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    loginSection.style.display = "none";
    mainSection.style.display = "block";
  } else {
    alert("Login fallido");
  }
});

function mostrarLogin() {
  formularioSection.style.display = "none";
  mainSection.style.display = "none";
  loginSection.style.display = "block";
}

function cargarDatos(tipo) {
  const token = localStorage.getItem("token");
  if (!token) return alert("Debes iniciar sesión.");

  formularioSection.style.display = "none";
  loginSection.style.display = "none";
  mainSection.style.display = "block";

  let url = "";
  let campos = {};
  let titulo = "";

  if (tipo === "productos") {
    url = "https://fakestoreapi.com/products";
    campos = { titulo: "title", imagen: "image", descripcion: "description", extra: "price" };
    titulo = "Listado de Productos";
  } else if (tipo === "usuarios") {
    url = "https://fakestoreapi.com/users";
    campos = { titulo: "username", imagen: "", descripcion: "email", extra: "id" };
    titulo = "Listado de Usuarios";
  } else if (tipo === "carritos") {
    url = "https://fakestoreapi.com/carts";
    campos = { titulo: "id", imagen: "", descripcion: "date", extra: "userId" };
    titulo = "Listado de Carritos";
  }

  tituloSeccion.innerText = titulo;
  contenedor.innerHTML = "<p class='text-center'>Cargando...</p>";

  fetch(url)
    .then(res => res.json())
    .then(data => {
      contenedor.innerHTML = "";
      data.forEach(item => {
        const img = campos.imagen && item[campos.imagen] ? `<img src="${item[campos.imagen]}" class="card-img-top">` : '';
        const card = `
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              ${img}
              <div class="card-body">
                <h5 class="card-title">${item[campos.titulo]}</h5>
                <p class="card-text">${item[campos.descripcion] || 'Sin descripción'}</p>
                <p class="card-text"><strong>Extra:</strong> ${item[campos.extra]}</p>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#detalleModal"
                  onclick='verDetalle(${JSON.stringify(item).replace(/'/g, "\\'")})'>
                  Ver Detalle
                </button>
              </div>
            </div>
          </div>
        `;
        contenedor.innerHTML += card;
      });
    })
    .catch(() => contenedor.innerHTML = `<p class="text-danger">Error al cargar los datos</p>`);
}

function verDetalle(item) {
  modalTitle.innerText = item.title || item.username || `ID ${item.id}`;
  modalBody.innerHTML = `<pre>${JSON.stringify(item, null, 2)}</pre>`;
}

function mostrarFormulario(tipo) {
  formularioGenerico.innerHTML = "";
  mainSection.style.display = "none";
  loginSection.style.display = "none";
  formularioSection.style.display = "block";

  let camposHTML = "";
  let endpoint = "";
  formTitle.innerText = `Agregar ${tipo}`;

  if (tipo === "producto") {
    camposHTML = `
      <input class="form-control mb-2" placeholder="Título" name="title" required>
      <input class="form-control mb-2" placeholder="Precio" name="price" type="number" required>
      <input class="form-control mb-2" placeholder="Imagen URL" name="image" required>
      <textarea class="form-control mb-2" placeholder="Descripción" name="description" required></textarea>
    `;
    endpoint = "https://fakestoreapi.com/products";
  } else if (tipo === "usuario") {
    camposHTML = `
      <input class="form-control mb-2" placeholder="Nombre de usuario" name="username" required>
      <input class="form-control mb-2" placeholder="Correo" name="email" required>
      <input class="form-control mb-2" placeholder="Contraseña" name="password" required>
    `;
    endpoint = "https://fakestoreapi.com/users";
  } else if (tipo === "carrito") {
    camposHTML = `
      <input class="form-control mb-2" placeholder="ID de usuario" name="userId" required>
      <input class="form-control mb-2" placeholder="Fecha (YYYY-MM-DD)" name="date" required>
    `;
    endpoint = "https://fakestoreapi.com/carts";
  }

  formularioGenerico.innerHTML = camposHTML + `
    <button class="btn btn-success w-100">Agregar</button>
  `;

  formularioGenerico.onsubmit = async function (e) {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(formularioGenerico).entries());

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    const resultado = await response.json();
    alert("Agregado correctamente");
    formularioSection.style.display = "none";
    mainSection.style.display = "block";
  };
}
