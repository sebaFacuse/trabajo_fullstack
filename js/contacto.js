document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formContacto');
    const nombre = document.getElementById('nombreUsuario');
    const apellido = document.getElementById('apellidoUsuario');
    const telefono = document.getElementById('telefonoUsuario');
    const email = document.getElementById('emailInput');
    const mensaje = document.getElementById('mensajeInput');
    const sugerenciaMensaje = document.getElementById('sugerenciaMensaje');
    const mensajeExito = document.getElementById('mensajeExito');

    const MAX_CARACTERES = 250;

    // Sugerencia dinámica en tiempo real (contador de caracteres)
    mensaje.addEventListener('input', () => {
        const restantes = MAX_CARACTERES - mensaje.value.length;
        sugerenciaMensaje.textContent = `Caracteres restantes: ${restantes}`;
        
        if (restantes < 0) {
            sugerenciaMensaje.classList.add('text-danger');
        } else {
            sugerenciaMensaje.classList.remove('text-danger');
        }
    });

    // Control de envío e inyección de errores de Bootstrap
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let esValido = true;

        mensajeExito.classList.add('d-none');

        // Validar Nombre
        if (nombre.value.trim().length < 2) {
            mostrarError(nombre, 'errorNombre', 'Por favor, ingresa tu nombre (mínimo 2 caracteres).');
            esValido = false;
        } else {
            marcarValido(nombre, 'errorNombre');
        }

        // Validar Apellido
        if (apellido.value.trim().length < 2) {
            mostrarError(apellido, 'errorApellido', 'Por favor, ingresa tu apellido.');
            esValido = false;
        } else {
            marcarValido(apellido, 'errorApellido');
        }

        // Validar Teléfono (Formato opcional)
        const regexTel = /^[+]?[\d\s-]{8,15}$/;
        if (telefono.value.trim() !== '' && !regexTel.test(telefono.value.trim())) {
            mostrarError(telefono, 'errorTelefono', 'Formato de teléfono inválido (ej. +56912345678).');
            esValido = false;
        } else {
            marcarValido(telefono, 'errorTelefono');
        }

        // Validar Correo Electrónico
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email.value.trim())) {
            mostrarError(email, 'errorEmail', 'Ingresa un correo electrónico válido (ej. usuario@dominio.com).');
            esValido = false;
        } else {
            marcarValido(email, 'errorEmail');
        }

        // Validar Mensaje
        const largoMensaje = mensaje.value.trim().length;
        if (largoMensaje < 10) {
            mostrarError(mensaje, 'errorMensaje', 'El mensaje debe tener al menos 10 caracteres.');
            esValido = false;
        } else if (largoMensaje > MAX_CARACTERES) {
            mostrarError(mensaje, 'errorMensaje', 'El mensaje excede los 250 caracteres permitidos.');
            esValido = false;
        } else {
            marcarValido(mensaje, 'errorMensaje');
        }

        // Respuesta exitosa
        if (esValido) {
            mensajeExito.classList.remove('d-none');
            form.reset();
            limpiarClasesValidez([nombre, apellido, telefono, email, mensaje]);
            sugerenciaMensaje.textContent = `Caracteres restantes: ${MAX_CARACTERES}`;
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
        elementos.forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });
    }
});