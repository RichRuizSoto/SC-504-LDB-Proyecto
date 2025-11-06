class AuthController {
    static async login({ usuario_o_email, contrasena }) {
        try {
            const res = await fetch('/api/auth/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_o_email, contrasena })
            });

            const data = await res.json();

            if (data.ok) {
                localStorage.setItem("id_usuario", data.id_usuario);
                localStorage.setItem("usuario", data.usuario);
                localStorage.setItem("email", data.email);
                localStorage.setItem("nombre", data.nombre);
            }

            return data;
        } catch (e) {
            return { ok: false, msg: e.message };
        }
    }

    static async getEmpresas() {
        try {
            const res = await fetch('/api/auth/get_empresas.php');
            return await res.json();
        } catch (e) {
            return [];
        }
    }

    static async getRoles() {
        try {
            const res = await fetch('/api/auth/get_roles.php');
            return await res.json();
        } catch (e) {
            return [];
        }
    }

    static async register(payload) {
        try {
            const res = await fetch('/api/auth/register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            return await res.json();
        } catch (e) {
            return { ok: false, msg: e.message };
        }
    }
}

window.AuthController = AuthController;
