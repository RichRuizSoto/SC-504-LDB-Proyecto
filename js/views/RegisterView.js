function RegisterView(){
  const el = document.createElement('div');
  el.className='card two';
  el.innerHTML = `
    <h2 class="title">Crear cuenta</h2>
    <div class="grid" style="margin-top:.5rem">
      <div class="two"><label>Nombre</label><input id="r-nombre" placeholder="Nombre y apellidos" /></div>
      <div class="two"><label>Usuario</label><input id="r-usuario" placeholder="usuario" /></div>
      <div class="two"><label>Email</label><input id="r-email" type="email" placeholder="correo@ejemplo.com" /></div>
      <div class="two"><label>Teléfono</label><input id="r-tel" placeholder="8888-8888" /></div>
      <div class="two"><label>Empresa</label><input id="r-empresa" placeholder="Mi Empresa" /></div>
      <div class="two">
        <label>Rol</label>
        <select id="r-rol">
          <option value="admin">Administrador</option>
          <option value="vendedor">Vendedor</option>
        </select>
      </div>
      <div class="two"><label>Contraseña</label><input id="r-pass" type="password" /></div>
    </div>
    <div class="row" style="margin-top:1rem">
      <button class="primary" id="btn-register">Crear cuenta</button>
      <a href="#/login" class="muted">¿Ya tenés cuenta? Ingresar</a>
    </div>
  `;

  el.querySelector('#btn-register').addEventListener('click', async ()=>{
    const payload = {
      nombre:   el.querySelector('#r-nombre').value.trim(),
      usuario:  el.querySelector('#r-usuario').value.trim(),
      email:    el.querySelector('#r-email').value.trim(),
      contrasena: el.querySelector('#r-pass').value,
      telefono: el.querySelector('#r-tel').value.trim(),
      empresa:  el.querySelector('#r-empresa').value.trim(), // backend resolverá id_empresa
      rol:      el.querySelector('#r-rol').value            // backend resolverá id_rol
    };

    if (Object.values(payload).some(v => !v)) {
      alert('Completá todos los campos');
      return;
    }

    try{
      if (!window.AuthController || typeof AuthController.register !== 'function') {
        alert('Demo: AuthController.register no está definido. Redirigiendo a Login…');
        location.hash = '#/login';
        return;
      }

      const res = await AuthController.register(payload);
      if (res.ok) {
        alert('Usuario creado. Ingresá ahora.');
        location.hash = '#/login';
      } else {
        alert(res.msg || 'No se pudo registrar');
      }
    } catch(e){
      alert(e.message || 'Error al registrar');
    }
  });

  return el;
}
