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
          <select id="r-empresa" class="register-select">
            <option value="">Seleccionar empresa</option>
          </select>
        </div>

        <div class="register-field field-rol">
          <label class="register-label">Rol</label>
          <select id="r-rol" class="register-select">
            <option value="">Seleccionar rol</option>
            <option value="admin">Administrador</option>
            <option value="vendedor">Vendedor</option>
          </select>
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

  async function loadOptions() {
    const empresaSelect = el.querySelector("#r-empresa");
    const rolSelect = el.querySelector("#r-rol");

    if (window.AuthController?.getEmpresas) {
      const empresas = await AuthController.getEmpresas();
      empresas.forEach((e) => {
        const opt = document.createElement("option");
        opt.value = e.id_empresa;
        opt.textContent = e.nombre;
        empresaSelect.appendChild(opt);
      });
    }

    if (window.AuthController?.getRoles) {
      const roles = await AuthController.getRoles();
      const allowedRoles = ["admin", "vendedor"];
      roles
        .filter((r) => allowedRoles.includes(r.nombre_rol.toLowerCase()))
        .forEach((r) => {
          const opt = document.createElement("option");
          opt.value = r.id_rol;
          opt.textContent = r.nombre_rol;
          rolSelect.appendChild(opt);
        });
    }
  }

  loadOptions();

  el.querySelector("#btn-register").addEventListener("click", async () => {
    const payload = {
      nombre: el.querySelector("#r-nombre").value.trim(),
      usuario: el.querySelector("#r-usuario").value.trim(),
      email: el.querySelector("#r-email").value.trim(),
      telefono: el.querySelector("#r-tel").value.trim(),
      contrasena: el.querySelector("#r-pass").value,
      id_empresa: el.querySelector("#r-empresa").value,
      id_rol: el.querySelector("#r-rol").value,
    };

    if (Object.values(payload).some((v) => !v)) {
      alert("Completá todos los campos");
      return;
    }

    try {
      if (
        !window.AuthController ||
        typeof AuthController.register !== "function"
      ) {
        alert(
          "Demo: AuthController.register no está definido. Redirigiendo a Login…"
        );
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
