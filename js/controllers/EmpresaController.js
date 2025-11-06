class EmpresaController {
  static async createEmpresaWithAdmin({ empresa, usuario }) {
    try {
      const res = await fetch("/api/empresas/crear.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empresa, usuario }),
      });
      return await res.json();
    } catch (e) {
      return { ok: false, msg: e.message };
    }
  }

  static async obtenerEmpresasUsuario(idUsuario) {
    try {
      const empresas = await ApiEmpresas.getEmpresasPorUsuario(idUsuario);
      return empresas;
    } catch (err) {
      console.error("Error cargando empresas:", err);
      return [];
    }
  }
}

window.EmpresaController = EmpresaController;
