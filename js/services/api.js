const API = {
  base: '/api',
  
  async post(path, data) {
    const res = await fetch(`${this.base}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async get(path) {
    const res = await fetch(`${this.base}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
};

async function getEmpresasPorUsuario(idUsuario) { return API.post('/empresas/por_usuario.php', { id_usuario: idUsuario }); }
async function getEmpresaInfo(idEmpresa) { return API.get(`/empresas/info.php?id_empresa=${idEmpresa}`); }

window.ApiEmpresas = {
  getEmpresasPorUsuario,
  getEmpresaInfo
};
