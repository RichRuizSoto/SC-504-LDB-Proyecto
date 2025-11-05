function EmpresasView() {
  const el = document.createElement('div');
  el.className = 'empresa-wrapper';

  el.innerHTML = `
    <div class="empresa-card">
      <h2 class="empresa-title">Crear Empresa</h2>

      <div class="empresa-section">
        <h3 class="section-title">Datos de la empresa</h3>
        <div class="empresa-grid">
          <div class="empresa-field">
            <label class="empresa-label">Nombre</label>
            <input id="e-nombre" class="empresa-input" placeholder="Nombre de la empresa" />
          </div>
          <div class="empresa-field">
            <label class="empresa-label">Cédula jurídica</label>
            <input id="e-cedula" class="empresa-input" placeholder="Cédula jurídica" />
          </div>
          <div class="empresa-field">
            <label class="empresa-label">Dirección</label>
            <input id="e-direccion" class="empresa-input" placeholder="Dirección de la empresa" />
          </div>
          <div class="empresa-field">
            <label class="empresa-label">Teléfono</label>
            <input id="e-telefono" class="empresa-input" placeholder="8888-8888" />
          </div>
          <div class="empresa-field">
            <label class="empresa-label">Email</label>
            <input id="e-email" class="empresa-input" type="email" placeholder="empresa@correo.com" />
          </div>
        </div>
      </div>

      <div class="usuario-section">
        <h3 class="section-title">Usuario administrador</h3>
        <div class="usuario-grid">
          <div class="usuario-field">
            <label class="usuario-label">Nombre completo</label>
            <input id="u-nombre" class="usuario-input" placeholder="Nombre completo" />
          </div>
          <div class="usuario-field">
            <label class="usuario-label">Usuario</label>
            <input id="u-usuario" class="usuario-input" placeholder="usuario" />
          </div>
          <div class="usuario-field">
            <label class="usuario-label">Email</label>
            <input id="u-email" type="email" class="usuario-input" placeholder="correo@dominio.com" />
          </div>
          <div class="usuario-field">
            <label class="usuario-label">Teléfono</label>
            <input id="u-telefono" class="usuario-input" placeholder="8888-8888" />
          </div>
          <div class="usuario-field">
            <label class="usuario-label">Contraseña</label>
            <input id="u-pass" class="usuario-input" type="password" placeholder="••••••••" />
          </div>
        </div>
      </div>

      <div class="empresa-actions">
        <button class="empresa-btn primary" id="btn-create">Crear Empresa y Admin</button>
      </div>
    </div>
  `;

  el.querySelector('#btn-create').addEventListener('click', async () => {
    const empresaPayload = {
      nombre: el.querySelector('#e-nombre').value.trim(),
      cedula_juridica: el.querySelector('#e-cedula').value.trim(),
      direccion: el.querySelector('#e-direccion').value.trim(),
      telefono: el.querySelector('#e-telefono').value.trim(),
      email: el.querySelector('#e-email').value.trim()
    };

    const usuarioPayload = {
      nombre: el.querySelector('#u-nombre').value.trim(),
      usuario: el.querySelector('#u-usuario').value.trim(),
      email: el.querySelector('#u-email').value.trim(),
      telefono: el.querySelector('#u-telefono').value.trim(),
      contrasena: el.querySelector('#u-pass').value,
      rol: 'vendedor' 
    };

    if (Object.values(empresaPayload).some(v => !v) || Object.values(usuarioPayload).some(v => !v)) {
      alert('Completá todos los campos de empresa y usuario administrador');
      return;
    }

    try {
      if (!window.EmpresaController?.createEmpresaWithAdmin) {
        alert('Demo: La función createEmpresaWithAdmin no está definida');
        return;
      }

      const res = await EmpresaController.createEmpresaWithAdmin({ empresa: empresaPayload, usuario: usuarioPayload });

      if (res.ok) {
        alert('Empresa y usuario administrador creados correctamente');
        location.hash = '#/login';
      } else {
        alert(res.msg || 'No se pudo crear la empresa y el usuario');
      }
    } catch (e) {
      alert(e.message || 'Error al crear empresa y usuario');
    }
  });

  return el;
}
