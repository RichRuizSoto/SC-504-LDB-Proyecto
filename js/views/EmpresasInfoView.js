async function EmpresasInfoView() {
  const root = document.createElement("div");
  root.className = "empinfo-wrapper";

  const idUsuario = localStorage.getItem("id_usuario");

  if (!idUsuario) {
    root.innerHTML = `
      <div class="empinfo-message">
        <h2 class="empinfo-title">No has iniciado sesión</h2>
        <p class="empinfo-text">Por favor, ingresá al sistema.</p>
      </div>
    `;
    return root;
  }

  // Cargar empresas del usuario
  let empresas = [];
  try {
    empresas = await ApiEmpresas.getEmpresasPorUsuario(idUsuario);
  } catch (e) {
    root.innerHTML = `
      <div class="empinfo-error">
        Error al cargar empresas: ${e.message}
      </div>
    `;
    return root;
  }

  // Sin empresas
  if (!empresas.length) {
    root.innerHTML = `
      <div class="empinfo-message">
        <h2 class="empinfo-title">No tenés empresas asignadas</h2>
        <p class="empinfo-text">Pedile a un administrador que te asigne una empresa.</p>
      </div>
    `;
    return root;
  }

  // Solo 1 empresa → mostrar perfil directo
  if (empresas.length === 1) {
    root.appendChild(renderEmpinfoPerfil(empresas[0]));
    return root;
  }

  // Varias empresas → lista
  root.innerHTML = `
    <h2 class="empinfo-heading">Mis Empresas</h2>
    <div class="empinfo-list"></div>
  `;

  const list = root.querySelector(".empinfo-list");

  empresas.forEach(emp => {
    const item = document.createElement("div");
    item.classList.add("empinfo-item");

    item.innerHTML = `
      <h3 class="empinfo-item-title">${emp.nombre}</h3>
      <p class="empinfo-item-email">${emp.email}</p>
      <button class="empinfo-btn" data-id="${emp.id_empresa}">
        Ver información
      </button>
    `;

    item.querySelector("button").addEventListener("click", () => {
      root.innerHTML = "";
      root.appendChild(renderEmpinfoPerfil(emp));
    });

    list.appendChild(item);
  });

  return root;
}

// ✅ Tarjeta de empresa con clases exclusivas
function renderEmpinfoPerfil(empresa) {
  const el = document.createElement("div");
  el.className = "empinfo-card";

  el.innerHTML = `
    <h2 class="empinfo-card-title">${empresa.nombre}</h2>

    <div class="empinfo-card-info">
      <p><strong>Cédula Jurídica:</strong> ${empresa.cedula_juridica || "N/A"}</p>
      <p><strong>Dirección:</strong> ${empresa.direccion || "Sin especificar"}</p>
      <p><strong>Teléfono:</strong> ${empresa.telefono || "N/A"}</p>
      <p><strong>Email:</strong> ${empresa.email || "N/A"}</p>
    </div>

  `;

  return el;
}
