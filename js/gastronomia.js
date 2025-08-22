let pedidos = [];
let ultimoId = 1;

function mostrarFormulario() {
  document.getElementById("formularioDelPedido").style.display = "block";
  document.getElementById("verPedidos").style.display = "none";
  document.getElementById("listaPedidos").style.display = "none";
}

function mostrarTodos() {
  document.getElementById("formularioDelPedido").style.display = "none";
  document.getElementById("verPedidos").style.display = "none";
}

function mostrarFiltro() {
  document.getElementById("formularioDelPedido").style.display = "none";
  document.getElementById("verPedidos").style.display = "block";
  document.getElementById("listaPedidos").style.display = "block";
}

// ---------- Guardar y cargar desde localStorage ----------
function guardarEnLocalStorage() {
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
}

function cargarDeLocalStorage() {
  const datos = localStorage.getItem("pedidos");
  if (datos) {
    pedidos = JSON.parse(datos);
    ultimoId = pedidos.length ? Math.max(...pedidos.map((t) => t.id)) + 1 : 1;
    mostrarTickets(pedidos);
  }
}

// ---------- Crear ticket ----------
function crearTicket(e) {
  e.preventDefault();

  const mesa = document.getElementById("mesa").value;
  const plato = document.getElementById("plato").value;
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const precio = parseFloat(document.getElementById("precio").value);

  if (!mesa || !plato) {
    return;
  }

  if (isNaN(cantidad) || cantidad <= 0) {
    return;
  }

  if (isNaN(precio) || precio <= 0) {
    return;
  }

  const resumen = {
    id: ultimoId++,
    mesa: mesa,
    plato: plato,
    cantidad: cantidad,
    precio: precio,
    total: precio * cantidad,
    estado: "abierto",
  };

  pedidos.push(resumen);
  guardarEnLocalStorage();
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Pedido recibido",
    showConfirmButton: false,
    timer: 1500,
  });

  mostrarTickets(pedidos);
  document.getElementById("pedidoFormulario").reset();
}

// ---------- Mostrar tickets ----------
function mostrarTickets(lista) {
  const listaPedidos = document.getElementById("listaPedidos");

  if (lista.length === 0) {
    listaPedidos.innerHTML = "<p>No hay pedidos</p>";
    return;
  }

  let mensaje = "<h3>Lista de Pedidos</h3>";

  lista.forEach((t) => {
    const claseEstado = t.estado === "abierto" ? "abierto" : "cerrado";
    mensaje += `
      <div class="${claseEstado}">
        <p><strong>ID:</strong> ${t.id}</p>
        <p><strong>ESTADO:</strong> ${t.estado}</p>
        <p><strong>MESA:</strong> ${t.mesa}</p>
        <p><strong>PLATO:</strong> ${t.plato}</p>
        <p><strong>PRECIO:</strong> ${t.precio}</p>
        <p><strong>CANTIDAD:</strong> ${t.cantidad}</p>
        <p><strong>TOTAL:  $</strong> ${t.total}</p>
        ${
          t.estado === "abierto"
            ? `<button class="btnCerrar" data-id="${t.id}">Cerrar Ticket</button>`
            : ""
        }
        <hr>
      </div>
    `;
  });

  listaPedidos.innerHTML = mensaje;

  const botonCerrar = document.querySelectorAll(".btnCerrar");
  botonCerrar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      cerrarTicketPorId(id);
    });
  });
}

// ---------- Cerrar ticket ----------
function cerrarTicketPorId(id) {
  const ticket = pedidos.find((t) => t.id === id);
  if (!ticket || ticket.estado === "cerrado") {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Ticket no válido o ya cerrado",
      showConfirmButton: false,
      timer: 1500,
    });

    return;
  }
  ticket.estado = "cerrado";
  guardarEnLocalStorage();
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Ticket cerrado",
    showConfirmButton: false,
    timer: 1500,
  });

  mostrarTickets(pedidos);
}

// ---------- Eliminar tickets cerrados ----------
function eliminarTicketsCerrados() {
  pedidos = pedidos.filter((t) => t.estado !== "cerrado");
  guardarEnLocalStorage();
  mostrarTickets(pedidos);
}
//-------------Consumo de API----------
URL = "https://worldtimeapi.org/api/timezone/America/Argentina/Salta";
function consumoDeApi() {
  fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      const hora = new Date(data.datetime).toLocaleTimeString();
      document.getElementById("consumoDeApi").textContent = `🕒 ${hora}`;
    })
    .catch((error) => {
      console.log("Se paro el reloj", error);
      document.getElementById("consumoDeApi").textContent =
        "⛔ El reloj no esta dando la hora";
    });
}
setInterval(consumoDeApi, 100);
consumoDeApi();
// ---------- Eventos ----------
document.getElementById("btnAplicarFiltro").addEventListener("click", () => {
  const estado = document.getElementById("filtroPedido").value;
  const filtrados =
    estado === "todos" ? pedidos : pedidos.filter((t) => t.estado === estado);
  mostrarTickets(filtrados);
});

document
  .getElementById("pedidoFormulario")
  .addEventListener("submit", crearTicket);

document
  .getElementById("btnEliminarCerrados")
  .addEventListener("click", eliminarTicketsCerrados);

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("formularioDelPedido").style.display = "none";
  document.getElementById("verPedidos").style.display = "none";

  document
    .getElementById("btnCrear")
    .addEventListener("click", mostrarFormulario);

  document
    .getElementById("btnVerPedidos")
    .addEventListener("click", mostrarTodos);

  document.getElementById("btnEstado").addEventListener("click", mostrarFiltro);

  cargarDeLocalStorage();
});
