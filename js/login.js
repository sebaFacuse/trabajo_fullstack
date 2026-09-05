document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');
    const correo = document.getElementById('correoLogin');
    const password = document.getElementById('passLogin');
    const mensajeExito = document.getElementById('mensajeExitoLogin');

    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        let esValido = true;

        mensajeExito.classList.add('d-none');

        // 1. Validar Correo Electrónico
        const emailVal = correo.value.trim();
        const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
        const esDominioValido = dominiosPermitidos.some(dominio => emailVal.endsWith(dominio));

        if (emailVal.length === 0) {
            mostrarError(correo, 'errorCorreoLogin', 'El correo es obligatorio.');
            esValido = false;
        } else if (emailVal.length > 100) {
            mostrarError(correo, 'errorCorreoLogin', 'El correo no puede exceder los 100 caracteres.');
            esValido = false;
        } else if (!esDominioValido) {
            mostrarError(correo, 'errorCorreoLogin', 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.');
            esValido = false;
        } else {
            marcarValido(correo, 'errorCorreoLogin');
        }

        // 2. Validar Contraseña
        const passVal = password.value.trim();
        if (passVal.length === 0) {
            mostrarError(password, 'errorPassLogin', 'La contraseña es obligatoria.');
            esValido = false;
        } else if (passVal.length < 4 || passVal.length > 10) {
            mostrarError(password, 'errorPassLogin', 'La contraseña debe tener entre 4 y 10 caracteres.');
            esValido = false;
        } else {
            marcarValido(password, 'errorPassLogin');
        }

        // Respuesta exitosa
        if (esValido) {
            mensajeExito.classList.remove('d-none');
            formLogin.reset();
            limpiarClasesValidez([correo, password]);

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