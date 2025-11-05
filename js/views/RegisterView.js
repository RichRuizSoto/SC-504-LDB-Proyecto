function RegisterView() {
  const el = document.createElement("div");
  el.className = "register-wrapper";

  el.innerHTML = `
    <div class="register-card">
      <h2 class="register-title">Crear cuenta</h2>
      <div class="register-grid">
        <div class="register-field field-nombre">
          <label class="register-label">Nombre completo</label>
          <input id="r-nombre" class="register-input" placeholder="Richard Ruiz Soto" />
        </div>
        <div class="register-field field-usuario">
          <label class="register-label">Usuario</label>
          <input id="r-usuario" class="register-input" placeholder="Rich" />
        </div>
        <div class="register-field field-email">
          <label class="register-label">Email</label>
          <input id="r-email" type="email" class="register-input" placeholder="rruiz10437@ufide.ac.cr" />
        </div>
        <div class="register-field field-telefono">
          <label class="register-label">Teléfono</label>
          <input id="r-tel" class="register-input" placeholder="8080-8000" />
        </div>
        <div class="register-field field-empresa">
          <label class="register-label">Empresa</label>
          <input id="r-empresa" class="register-input" placeholder="Nombre de la empresa" />
        </div>
        <div class="register-field field-rol">
          <label class="register-label">Rol</label>
          <input id="r-rol" class="register-input" placeholder="Rol (ej: admin, vendedor)" />
        </div>
        <div class="register-field field-pass">
          <label class="register-label">Contraseña</label>
          <input id="r-pass" type="password" class="register-input" placeholder="••••••••" />
        </div>
      </div>
      <div class="register-actions">
        <button class="register-btn primary" id="btn-register">Crear cuenta</button>
        <a href="#/login" class="register-link muted">¿Ya tenés cuenta? Ingresar</a>
      </div>
    </div>
  `;

  el.querySelector("#btn-register").addEventListener("click", async () => {
    const payload = {
      nombre: el.querySelector("#r-nombre").value.trim(),
      usuario: el.querySelector("#r-usuario").value.trim(),
      email: el.querySelector("#r-email").value.trim(),
      telefono: el.querySelector("#r-tel").value.trim(),
      contrasena: el.querySelector("#r-pass").value,
      id_empresa: el.querySelector("#r-empresa").value.trim(),
      id_rol: el.querySelector("#r-rol").value.trim()
    };

    if (Object.values(payload).some(v => !v)) {
      alert("Completá todos los campos");
      return;
    }

    try {
      if (!window.AuthController || typeof AuthController.register !== "function") {
        location.hash = "#/login";
        return;
      }

      const res = await AuthController.register(payload);
      if (res.ok) {
        alert("Usuario creado. Ingresá ahora.");
        location.hash = "#/login";
      } else {
        alert(res.msg || "No se pudo registrar");
      }
    } catch (e) {
      alert(e.message || "Error al registrar");
    }
  });

  return el;
}
