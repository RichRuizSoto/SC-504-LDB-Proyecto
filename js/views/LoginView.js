function LoginView() {
    const container = document.createElement('div');
    container.className = 'login-wrapper';

    container.innerHTML = `
        <div class="login-card">
            <h2 class="login-title">Iniciar sesión</h2>
            <p class="login-subtitle">Accedé con tu usuario o email.</p>

            <div class="login-grid">
                <div class="login-field">
                    <label class="login-label">Usuario o Email</label>
                    <input id="login-user" class="login-input" placeholder="usuario o email" />
                </div>
                <div class="login-field">
                    <label class="login-label">Contraseña</label>
                    <input id="login-pass" type="password" class="login-input" placeholder="••••••••" />
                </div>
            </div>

            <div class="login-actions">
                <button class="login-btn-primary" id="login-btn">Entrar</button>
            </div>
        </div>
    `;

    container.querySelector('#login-btn').addEventListener('click', async () => {
        const usuario_o_email = container.querySelector('#login-user').value.trim();
        const contrasena = container.querySelector('#login-pass').value;

        if (!usuario_o_email || !contrasena)
            return alert('Completá usuario y contraseña');

        const res = await AuthController.login({ usuario_o_email, contrasena });

        if (!res.ok) {
            alert(res.msg || 'Credenciales inválidas');
            return;
        }

        localStorage.setItem("id_usuario", res.id_usuario);
        localStorage.setItem("usuario", res.usuario);
        localStorage.setItem("email", res.email);
        localStorage.setItem("nombre", res.nombre);

        alert('¡Bienvenido!');
        location.hash = '#/mis-empresas';
    });

    return container;
}
