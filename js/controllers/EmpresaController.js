class EmpresaController {
  static async createEmpresaWithAdmin({ empresa, usuario }) {
    try {
      const res = await fetch('/api/empresas/crear.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empresa, usuario })
      });
      return await res.json();
    } catch (e) {
      return { ok: false, msg: e.message };
    }
  }
}

window.EmpresaController = EmpresaController;
