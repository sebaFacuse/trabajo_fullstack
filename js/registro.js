document.addEventListener('DOMContentLoaded', () => {
    // 1. Arreglo complementario de Regiones y Comunas
    const datosUbicacion = [
        { region: "Región Metropolitana", comunas: ["Santiago", "Providencia", "Maipú", "Puente Alto", "La Florida"] },
        { region: "Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"] },
        { region: "Biobío", comunas: ["Concepción", "Talcahuano", "Los Ángeles", "Chiguayante"] },
        { region: "Araucanía", comunas: ["Temuco", "Villarrica", "Pucón", "Angol"] }
    ];

    // Variables del DOM
    const form = document.getElementById('formRegistro');
    const selectRegion = document.getElementById('regionRegistro');
    const selectComuna = document.getElementById('comunaRegistro');
    const inputRut = document.getElementById('rutRegistro');
    const inputNombre = document.getElementById('nombreRegistro');
    const inputApellido = document.getElementById('apellidoRegistro');
    const inputCorreo = document.getElementById('correoRegistro');
    const inputPass = document.getElementById('passRegistro');
    const inputPassConf = document.getElementById('passConfRegistro');
    const inputDireccion = document.getElementById('direccionRegistro');
    const mensajeExito = document.getElementById('mensajeExitoRegistro');

    datosUbicacion.forEach(dato => {
        const option = document.createElement('option');
        option.value = dato.region;
        option.textContent = dato.region;
        selectRegion.appendChild(option);
    });

    selectRegion.addEventListener('change', (e) => {
        const regionSeleccionada = e.target.value;
        

        selectComuna.innerHTML = '<option value="">-- Seleccione una comuna --</option>';
        
        if (regionSeleccionada === "") {
            selectComuna.disabled = true;
            return;
        }

        const dataRegion = datosUbicacion.find(d => d.region === regionSeleccionada);
        if (dataRegion) {
            selectComuna.disabled = false;
            dataRegion.comunas.forEach(comuna => {
                const option = document.createElement('option');
                option.value = comuna;
                option.textContent = comuna;
                selectComuna.appendChild(option);
            });
        }
    });

    // 4. Algoritmo para validar un RUT 
    function validarRutChileno(rutCompleto) {
        if (!/^[0-9]+[0-9kK]$/.test(rutCompleto)) return false;
        
        let cuerpo = rutCompleto.slice(0, -1);
        let dv = rutCompleto.slice(-1).toUpperCase();
        
        let suma = 0;
        let multiplo = 2;
        
        for (let i = 1; i <= cuerpo.length; i++) {
            let index = multiplo * rutCompleto.charAt(cuerpo.length - i);
            suma = suma + index;
            if (multiplo < 7) { multiplo = multiplo + 1; } else { multiplo = 2; }
        }
        
        let dvEsperado = 11 - (suma % 11);
        dvEsperado = (dvEsperado == 11) ? 0 : (dvEsperado == 10) ? "K" : dvEsperado;
        
        return dv == dvEsperado;
    }

    // 5. Validaciones al hacer submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let esValido = true;
        mensajeExito.classList.add('d-none');

        // Validar RUN (Requerido, sin puntos ni guion, min 7, max 9, Módulo 11)
        const rutVal = inputRut.value.trim().toUpperCase();
        if (rutVal.length === 0) {
            mostrarError(inputRut, 'errorRut', 'El RUN es obligatorio.');
            esValido = false;
        } else if (rutVal.length < 7 || rutVal.length > 9 || !validarRutChileno(rutVal)) {
            mostrarError(inputRut, 'errorRut', 'El RUN no es válido. Escríbelo sin puntos ni guion (Ej: 19011022K).');
            esValido = false;
        } else {
            marcarValido(inputRut, 'errorRut');
        }

        // Validar Nombre (Requerido, Max 50)
        const nombreVal = inputNombre.value.trim();
        if (nombreVal.length === 0 || nombreVal.length > 50) {
            mostrarError(inputNombre, 'errorNombre', 'Obligatorio, máximo 50 caracteres.');
            esValido = false;
        } else {
            marcarValido(inputNombre, 'errorNombre');
        }

        // Validar Apellidos 
        const apellidoVal = inputApellido.value.trim();
        if (apellidoVal.length === 0 || apellidoVal.length > 100) {
            mostrarError(inputApellido, 'errorApellido', 'Obligatorio, máximo 100 caracteres.');
            esValido = false;
        } else {
            marcarValido(inputApellido, 'errorApellido');
        }

        // Validar Correo 
        const emailVal = inputCorreo.value.trim();
        const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
        const esDominioValido = dominiosPermitidos.some(dominio => emailVal.endsWith(dominio));

        if (emailVal.length === 0 || emailVal.length > 100 || !esDominioValido) {
            mostrarError(inputCorreo, 'errorCorreo', 'Obligatorio, máx 100 caracteres. Solo @duoc.cl, @profesor.duoc.cl o @gmail.com.');
            esValido = false;
        } else {
            marcarValido(inputCorreo, 'errorCorreo');
        }

        // Validar Contraseña 
        const passVal = inputPass.value.trim();
        if (passVal.length < 4 || passVal.length > 10) {
            mostrarError(inputPass, 'errorPass', 'La contraseña debe tener entre 4 y 10 caracteres.');
            esValido = false;
        } else {
            marcarValido(inputPass, 'errorPass');
        }

        // Validar Confirmar Contraseña
        if (inputPassConf.value.trim() !== passVal || inputPassConf.value.trim() === '') {
            mostrarError(inputPassConf, 'errorPassConf', 'Las contraseñas no coinciden.');
            esValido = false;
        } else {
            marcarValido(inputPassConf, 'errorPassConf');
        }

        // Validar Región y Comuna
        if (selectRegion.value === "") {
            mostrarError(selectRegion, 'errorRegion', 'Debes seleccionar una región.');
            esValido = false;
        } else {
            marcarValido(selectRegion, 'errorRegion');
        }

        if (selectComuna.value === "") {
            mostrarError(selectComuna, 'errorComuna', 'Debes seleccionar una comuna.');
            esValido = false;
        } else {
            marcarValido(selectComuna, 'errorComuna');
        }

        // Validar Dirección
        const direccionVal = inputDireccion.value.trim();
        if (direccionVal.length === 0 || direccionVal.length > 300) {
            mostrarError(inputDireccion, 'errorDireccion', 'La dirección es obligatoria y de máximo 300 caracteres.');
            esValido = false;
        } else {
            marcarValido(inputDireccion, 'errorDireccion');
        }

        // Finalizar
        if (esValido) {
            mensajeExito.classList.remove('d-none');
            form.reset();
            selectComuna.innerHTML = '<option value="">-- Seleccione una comuna --</option>';
            selectComuna.disabled = true;
            limpiarClasesValidez([inputRut, inputNombre, inputApellido, inputCorreo, inputPass, inputPassConf, selectRegion, selectComuna, inputDireccion]);
        }
    });

    function mostrarError(element, errorId, mensajeTexto) {
        element.classList.add('is-invalid');
        element.classList.remove('is-valid');
        document.getElementById(errorId).textContent = mensajeTexto;
    }

    function marcarValido(element, errorId) {
        element.classList.remove('is-invalid');
        element.classList.add('is-valid');
        document.getElementById(errorId).textContent = '';
    }

    function limpiarClasesValidez(elementos) {
        elementos.forEach(el => el.classList.remove('is-valid', 'is-invalid'));
    }
});