const loginForm = document.getElementById("login-form");
const loginSection = document.getElementById("login-section");
const mainSection = document.getElementById("main-section");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (email === "" || password === "") {
    alert("Por favor completa todos los campos.");
    return;
  }

  if (!validateEmail(email)) {
    alert("Correo no válido.");
    return;
  }


  loginSection.style.display = "none";
  mainSection.style.display = "block";
});

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}


const contenedor = document.getElementById("data-container");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const tituloSeccion = document.getElementById("titulo-seccion");

function cargarDatos(tipo) {
  let url = "";
  let campos = {};
  let titulo = "";

  if (tipo === "productos") {
    url = "https://fakestoreapi.com/products";
    campos = { titulo: "title", imagen: "image", descripcion: "description", extra: "price" };
    titulo = "Listado de Productos";
  } else if (tipo === "usuarios") {
    url = "https://fakestoreapi.com/users";
    campos = { titulo: "username", imagen: "image", descripcion: "email", extra: "id" };
    titulo = "Listado de Usuarios";
  } else if (tipo === "carritos") {
    url = "https://fakestoreapi.com/carts";
    campos = { titulo: "id", imagen: "image", descripcion: "date", extra: "userId" };
    titulo = "Listado de Carritos";
  }

  tituloSeccion.innerText = titulo;
  contenedor.innerHTML = "<p class='text-center'>Cargando...</p>";

  fetch(url)
    .then(res => res.json())
    .then(data => {
      contenedor.innerHTML = "";
      data.forEach(item => {
        const img = campos.imagen ? `<img src="${item[campos.imagen]}" class="card-img-top">` : '';
        const card = `
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              ${img}
              <div class="card-body">
                <h5 class="card-title">${item[campos.titulo]}</h5>
                <p class="card-text">${item[campos.descripcion] || 'Sin descripción'}</p>
                <p class="card-text"><strong>ID/Extra:</strong> ${item[campos.extra]}</p>
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
    .catch(err => {
      contenedor.innerHTML = `<p class="text-danger">Error al cargar los datos</p>`;
      console.error(err);
    });

    const product = { title: 'New Product', price: 29.99 };
  fetch('https://fakestoreapi.com/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(product)
})
  .then(response => response.json())
  .then(data => console.log(data));
}

function verDetalle(item) {
  modalTitle.innerText = item.title || item.username || `ID ${item.id}`;
  modalBody.innerHTML = `<pre>${JSON.stringify(item, null, 2)}</pre>`;
}