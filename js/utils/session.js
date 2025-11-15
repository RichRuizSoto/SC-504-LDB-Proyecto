// Utilidades para manejo de sesión

const SessionUtils = {
    // Validar si existe sesión activa
    validarSesion() {
        const idUsuario = localStorage.getItem('id_usuario');
        const nombreUsuario = localStorage.getItem('nombre');
        
        return !!(idUsuario && nombreUsuario);
    },

    // Obtener datos del usuario actual
    obtenerUsuario() {
        if (!this.validarSesion()) {
            return null;
        }

        return {
            id: parseInt(localStorage.getItem('id_usuario')),
            usuario: localStorage.getItem('usuario'),
            email: localStorage.getItem('email'),
            nombre: localStorage.getItem('nombre')
        };
    },

    // Guardar sesión
    guardarSesion(userData) {
        localStorage.setItem('id_usuario', userData.id_usuario);
        localStorage.setItem('usuario', userData.usuario);
        localStorage.setItem('email', userData.email);
        localStorage.setItem('nombre', userData.nombre);
    },

    // Cerrar sesión
    cerrarSesion() {
        localStorage.removeItem('id_usuario');
        localStorage.removeItem('usuario');
        localStorage.removeItem('email');
        localStorage.removeItem('nombre');
    },

    // Redirigir al login si no hay sesión
    requerirSesion(mensajeError = 'Debes iniciar sesión para acceder') {
        if (!this.validarSesion()) {
            // Mostrar toast si existe la función
            if (typeof toast === 'function') {
                toast(mensajeError);
            }
            
            // Redirigir después de un breve delay
            setTimeout(() => {
                window.location.href = 'index.html#/login';
            }, 1500);
            
            return false;
        }
        
        return true;
    },

    // Verificar si el usuario tiene un rol específico
    tieneRol(rol) {
        // Por ahora solo valida si hay sesión
        return this.validarSesion();
    }
};

// Exportar como global
window.SessionUtils = SessionUtils;