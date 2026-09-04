const carrito = [];

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

        actualizarCarritoUI();

        // LÍNEA NUEVA: Muestra el mensaje al usuario
        alert(`¡${producto.marca} ${producto.modelo} agregado al carrito!`);
    });
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    const contador = document.getElementById("contador-carrito");
    const lista = document.getElementById("lista-carrito");
    const totalElement = document.getElementById("total-carrito");

    if (!contador || !lista || !totalElement) return;

    contador.textContent = carrito.length;

    if (carrito.length == 0) {
        lista.innerHTML = '<li class="list-group-item text-muted text-center py-4">El carrito está vacío</li>';
        totalElement.textContent = "$0";
        return;
    }

    lista.innerHTML = "";
    let total = 0;

    carrito.forEach((producto, index) => {
        // 2. Multiplicamos precio por la cantidad guardada
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