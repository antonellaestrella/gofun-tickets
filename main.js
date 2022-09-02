let entradas = [];
fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    cargarProductos(data);
  });

const cargarProductos = (data) => {
  entradas = data;
  const entradasContainer = document.getElementById("eventos_container");
  entradas.forEach((entrada, indice) => {
    let { imagen, nombre, precio } = entrada;
    let card = document.createElement("div");
    card.classList.add("card", "col-sm-12", "col-lg-3");
    card.innerHTML = `<img src="${imagen}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${nombre}</h5>
      <p class="card-text"> Por única vez este año presentando su nuevo World Tour 
      </p>
      <p class="card-text">${precio}</p>
      <a href="#open-cart" class="btn" onClick="agregarAlCarrito(${indice})">Quiero mi entrada</a>
    </div>`;
    entradasContainer.appendChild(card);
  });
};
let carrito = [];
const actualizarLocalStorage = (carrito) => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

const agregarAlCarrito = (indice) => {
  const indiceEntrada = carrito.findIndex((elemento) => {
    return elemento.id === entradas[indice].id;
  });
  if (indiceEntrada === -1) {
    const entradaAgregada = entradas[indice];
    entradaAgregada.cantidad = 1;
    carrito.push(entradaAgregada);
    actualizarLocalStorage(carrito);
    dibujarCarrito();
  } else {
    carrito[indiceEntrada].cantidad += 1;
    actualizarLocalStorage(carrito);
    dibujarCarrito();
  }
};

const abrirCarrito = document.getElementById("open-cart");
const cerrarCarrito = document.getElementById("close-cart");
const carritoContainer = document.getElementsByClassName("cart-container")[0];
let contenedorCarrito = document.getElementById("carrito");

abrirCarrito.addEventListener("click", () => {
  carritoContainer.classList.add("cart-opened");
  if (carrito.length == "") {
    contenedorCarrito.innerHTML = `<h2 class="carrito-mje">NO HAY PRODUCTOS EN EL CARRITO</h2>`;
  }
});

cerrarCarrito.addEventListener("click", () => {
  carritoContainer.classList.remove("cart-opened");
});

let total = 0;

const dibujarCarrito = () => {
  contenedorCarrito.className = "carrito";
  contenedorCarrito.innerHTML = "";
  let cantidadCarrito = 0;
  if (carrito.length > 0) {
    carrito.forEach((entrada, indice) => {
      let { precio, cantidad, nombre, imagen } = entrada;
      total = total + entrada.precio * entrada.cantidad;
      cantidadCarrito = cantidadCarrito + cantidad;
      modalCarrito = document.createElement("div");
      modalCarrito.className = "entradas_carrito";
      modalCarrito.innerHTML = `<img class= "entrada-img" src="${imagen}"/>
    <div class="entrada-detalle">${nombre}</div>
    <div class="entrada-detalle"> Cantidad: ${cantidad}</div>
    <div class="entrada-detalle"> Precio: $ ${precio}</div>
    <div class="entrada-detalle"> Subtotal:$ ${precio * cantidad}</div>
    <button class= "btn" id="eliminar-producto" onClick="eliminarEntrada(${indice})">Eliminar</button>`;
      contenedorCarrito.appendChild(modalCarrito);
    });

    const totalContenedor = document.createElement("div");
    totalContenedor.className = "total-container";
    totalContenedor.innerHTML = `<div class="total">TOTAL: ${total}</div>
    <button class= "btn  finalizar" id="finalizar" onClick="finalizarCompra()"> FINALIZAR COMPRA </button>`;
    contenedorCarrito.appendChild(totalContenedor);
    const contadorCarrito = document.getElementById("count__cart");
    contadorCarrito.innerHTML = cantidadCarrito;
    contadorCarrito.style.display = "inline-block";
  } else {
    contenedorCarrito.classList.remove("carrito");

    const contadorCarrito = document.getElementById("count__cart");
    contadorCarrito.style.display = "none";
  }
};
const finalizarCompra = () => {
  const total = document.getElementsByClassName("total")[0].innerHTML;
  contenedorCarrito.innerHTML = "";
  const compraFinalizada = `<div class="compra-finalizada"><p class="compra-parrafo"> YA CASI ES TUYA LA COMPRA!!   ${total} </p></div>
  <div class="datos-cliente">
  <p class="datos-parrafo"> Complete el formulario con sus datos para coordinar la entrega</p>
  <button class= "btn  formulario" id="formulario" onClick="dibujarFormu()"> FORMULARIO </button>
  </div>`;
  contenedorCarrito.innerHTML = compraFinalizada;
  localStorage.clear("carrito");
};

if (localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"));
  dibujarCarrito();
}

const eliminarEntrada = (indice) => {
  carrito.splice(indice, 1);
  actualizarLocalStorage(carrito);
  dibujarCarrito();
};

const dibujarFormu = () => {
  contenedorCarrito.innerHTML = "";
  contenedorCarrito.classList.add("formu");
  const formulario = `
  <h2> DATOS PARA EL ENVÍO </h2>
     <div class="contact__secction-container container">
       <label>Nombre</label>
       <input type="text" id="nombre" placeholder="Nombre"  />
       <label>E-mail</label>
       <input type="text" id="mail" placeholder="E-mail" />
       <label>Telefono</label>
       <input type="text" id="telefono" placeholder="Telefono"  />
       <label>Domicilio</label>
       <input type="text" id="domicilio" placeholder="Domicilio" />
      <div class="contact-button">
       <button type="button" class="btn  envio" onClick="mostrarMensaje()" >Confirmar</button>
     </div>
   </div>
 </div>`;
  contenedorCarrito.innerHTML = formulario;
};

const mostrarMensaje = () => {
  const nombreCliente = document.getElementById("nombre").value;
  const mail = document.getElementById("mail").value;
  contenedorCarrito.innerHTML = "";
  let mensaje = `<div class="mensaje-final"> MUCHAS GRACIAS POR SU COMPRA!! </div>`;
  contenedorCarrito.innerHTML = mensaje;
  Swal.fire({
    position: "center",
    icon: "success",
    title: `Fecilidades ${nombreCliente} ya tenes tu entrada!! Recibiras un QR a tu correo ${mail} `,
    showConfirmButton: true,
    allowOutsideClick: false,
  });
};
