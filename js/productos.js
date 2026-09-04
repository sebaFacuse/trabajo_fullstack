let todosLosProductos = [];

// 1. Lee el archivo JSON con los datos, los guarda en memoria e inicia la carga inicial de la página
fetch("data/productos.json")
.then(respuesta => respuesta.json())
.then(productos => {
    todosLosProductos = productos;
    cargarProductosPagina();
});

// Detecta el nombre de la página actual, busca la lista de productos correspondiente y manda a dibujarlos
function cargarProductosPagina() {
    let pagina = decodeURIComponent(window.location.pathname.split("/").pop().toLowerCase());
    let lista = obtenerProductosPorPagina(pagina);
    mostrarProductos(lista);
}

// Filtra el JSON según la vista: los ID elegidos para Inicio, la categoría (árabe/diseñador/nicho) o todo en Catálogo
function obtenerProductosPorPagina(pagina) {
    if (pagina.includes("index") || pagina === "" || pagina === "index.html") {
        let idsInicio = [6, 2, 3,17,]; // <-- PON AQUÍ LOS ID DE TU JSON
        return todosLosProductos.filter(p => idsInicio.includes(Number(p.id)));
    } else if (pagina.includes("arabe")) {
        return todosLosProductos.filter(p => p.tipo && p.tipo.toLowerCase().includes("arabe"));
    } else if (pagina.includes("dise") || pagina.includes("disenador")) {
        return todosLosProductos.filter(p => p.tipo && (p.tipo.toLowerCase().includes("diseñador") || p.tipo.toLowerCase().includes("disenador")));
    } else if (pagina.includes("nicho")) {
        return todosLosProductos.filter(p => p.tipo && p.tipo.toLowerCase().includes("nicho"));
    }
    return todosLosProductos;
}

// Genera e inyecta dinámicamente las tarjetas HTML con la información de cada perfume dentro del contenedor
function mostrarProductos(productos) {
    let contenedor = document.getElementById("contenedor-productos");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    if (productos.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 w-100 text-center py-5">
                <p class="text-muted fs-5">No hay productos disponibles por el momento.</p>
            </div>`;
        return;
    }

    productos.forEach(producto => {
        let imagen = producto.imagenes ? producto.imagenes.split(",")[0] : (producto.imagen || '');

        contenedor.innerHTML += `
            <div class="col perfume-card" data-gender="${producto.genero}">
                <div class="card h-100 border-0 shadow-sm">
                    <a href="detalle.html?id=${producto.id}">
                        <img src="${imagen}" class="card-img-top p-3" alt="${producto.marca} ${producto.modelo}">
                    </a>
                    <div class="card-body text-center d-flex flex-column justify-content-between">
                        <div>
                            <span class="text-muted small">${producto.tipo} • ${producto.genero}</span>
                            <h5 class="card-title fw-bold mt-1">${producto.marca} ${producto.modelo}</h5>
                            <p class="card-text text-muted">Eau de Parfum - ${producto.volumen || ''}</p>
                        </div>
                        <div>
                            <p class="fw-bold text-dark fs-5 my-2">$${producto.precio.toLocaleString("es-CL")}</p>
                            <button onclick="agregarAlCarrito(${producto.id})" class="btn btn-dark w-100 rounded-0">Agregar al carrito</button>
                        </div>
                    </div>
                </div>
            </div>`;
    });
}

// Actualiza el diseño visual de los botones de filtro y sub-filtra la lista de la página por género o sub-tipo
function filtrarProductos(criterio, boton) {
    const botones = document.querySelectorAll(".filter-btn");
    botones.forEach(btn => {
        btn.classList.remove("btn-dark", "active");
        btn.classList.add("btn-outline-dark");
    });
    boton.classList.remove("btn-outline-dark");
    boton.classList.add("btn-dark", "active");

    let pagina = decodeURIComponent(window.location.pathname.split("/").pop().toLowerCase());
    let lista = obtenerProductosPorPagina(pagina);

    if (criterio != "todos") {
        lista = lista.filter(p => {
            let generoMatch = p.genero && p.genero.toLowerCase() === criterio.toLowerCase();
            let tipoMatch = p.tipo && p.tipo.toLowerCase() === criterio.toLowerCase();
            return generoMatch || tipoMatch;
        });
    }

    mostrarProductos(lista);
}