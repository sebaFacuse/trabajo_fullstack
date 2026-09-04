let parametros = new URLSearchParams(window.location.search);
let id = parametros.get("id");

fetch("data/productos.json")
.then(respuesta => respuesta.json())
.then(productos => {
    let producto = productos.find(p => p.id == id);
    let contenedor = document.getElementById("detalle-producto");

    if (producto) {
        let imagen = producto.imagenes.split(",")[0];
        contenedor.innerHTML = `
            <div class="col-md-6">
                <img src="${imagen}" class="img-fluid" alt="${producto.marca} ${producto.modelo}">
            </div>
            <div class="col-md-6">
                <span class="text-muted">${producto.tipo} • ${producto.genero}</span>
                <h2 class="fw-bold mt-2">${producto.marca} ${producto.modelo}</h2>
                <p>Eau de Parfum - ${producto.volumen}</p>
                <h4 class="fw-bold">$${producto.precio.toLocaleString("es-CL")}</h4>
                <button onclick="agregarAlCarrito(${producto.id})" class="btn btn-dark">Agregar al carrito</button>
            </div>`;
    }
});
