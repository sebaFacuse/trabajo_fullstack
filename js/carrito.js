// Cargar el carrito guardado en el navegador o iniciar uno vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Guardar en el almacenamiento del navegador
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(id) {
    fetch("data/productos.json")
    .then(respuesta => respuesta.json())
    .then(productos => {
        let producto = productos.find(p => p.id == id);
        let existe = carrito.find(p => p.id == id);

        if (existe) {
            existe.cantidad++;
        } else {
            producto.cantidad = 1;
            carrito.push(producto);
        }

        guardarCarrito(); // Guarda los cambios entre páginas
        actualizarCarritoUI();

        alert(`¡${producto.marca} ${producto.modelo} agregado al carrito!`);
    });
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito(); // Guarda la eliminación
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    const contador = document.getElementById("contador-carrito");
    const lista = document.getElementById("lista-carrito");
    const totalElement = document.getElementById("total-carrito");

    if (!contador || !lista || !totalElement) return;

    const totalUnidades = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    contador.textContent = totalUnidades;

    if (carrito.length === 0) {
        lista.innerHTML = '<li class="list-group-item text-muted text-center py-4">El carrito está vacío</li>';
        totalElement.textContent = "$0";
        return;
    }

    lista.innerHTML = "";
    let total = 0;

    carrito.forEach((producto, index) => {
        total += producto.precio * producto.cantidad;

        lista.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                <div>
                    <h6 class="my-0 fw-bold">${producto.marca} ${producto.modelo} (x${producto.cantidad})</h6>
                    <small class="text-muted">$${(producto.precio * producto.cantidad).toLocaleString("es-CL")}</small>
                </div>
                <button class="btn btn-sm btn-outline-danger border-0" onclick="eliminarDelCarrito(${index})">✕</button>
            </li>`;
    });

    totalElement.textContent = `$${total.toLocaleString("es-CL")}`;
}

function finalizarCompra() {
    if (carrito.length === 0) {
        alert("⚠️ Tu carrito está vacío. Agrega productos antes de finalizar la compra.");
        return;
    }

    alert("🎉 ¡Compra realizada con éxito! Muchas gracias por tu pedido.");

    carrito = [];
    guardarCarrito(); // Limpia la memoria local al comprar
    actualizarCarritoUI();

    const offcanvasElement = document.getElementById('offcanvasCarrito');
    if (offcanvasElement) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
        if (bsOffcanvas) {
            bsOffcanvas.hide();
        }
    }
}

// Cargar la interfaz con los datos guardados en cuanto se abra la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarCarritoUI();

    const btnFinalizar = document.getElementById('btn-finalizar-compra') || 
                         document.querySelector('#offcanvasCarrito .border-top button');

    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', finalizarCompra);
    }
});