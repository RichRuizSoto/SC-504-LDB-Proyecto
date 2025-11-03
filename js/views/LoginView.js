function LoginView(){
  const el = document.createElement('div');
  el.className = 'card two';
  el.innerHTML = `
    <h2 class="title">Iniciar sesión</h2>
    <p class="muted">Accedé con tu usuario o email.</p>
    <div class="grid" style="margin-top:.5rem">
      <div class="two"><label>Usuario o Email</label><input id="f-user" placeholder="usuario o email" /></div>
      <div class="two"><label>Contraseña</label><input id="f-pass" type="password" placeholder="••••••••" /></div>
    </div>
    <div class="row" style="margin-top:1rem">
      <button class="primary" id="btn-login">Entrar</button>
      <a href="#/register" class="muted">¿No tenés cuenta? Crear una</a>
    </div>
  `;

  el.querySelector('#btn-login').addEventListener('click', async () => {
    const usuario_o_email = el.querySelector('#f-user').value.trim();
    const contrasena = el.querySelector('#f-pass').value;

    if (!usuario_o_email || !contrasena) {
      alert('Completá usuario y contraseña');
      return;
    }

    try {
      if (!window.AuthController || typeof AuthController.login !== 'function') {
        // Fallback si aún no tenés el controlador
        alert('Demo: AuthController.login no está definido. Redirigiendo a Productos…');
        location.hash = '#/productos';
        return;
      }

      const res = await AuthController.login({ usuario_o_email, contrasena });
      if (res.ok) {
        alert('¡Bienvenido!');
        location.hash = '#/productos';
      } else {
        alert(res.msg || 'Credenciales inválidas');
      }
    } catch (e) {
      alert(e.message || 'Error al iniciar sesión');
    }
  });

  return el;
}
