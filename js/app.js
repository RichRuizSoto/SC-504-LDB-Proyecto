(function () {
  const $ = (s, r = document) => r.querySelector(s);

  const routes = {
    "#/login":
      typeof LoginView === "function"
        ? LoginView
        : () => document.createTextNode("LoginView no definida"),

    "#/register":
      typeof RegisterView === "function"
        ? RegisterView
        : () => document.createTextNode("RegisterView no definida"),

    "#/productos":
      typeof ProductosView === "function"
        ? ProductosView
        : () => document.createTextNode("ProductosView no definida"),

    "#/empresas":
      typeof EmpresasView === "function"
        ? EmpresasView
        : () => document.createTextNode("EmpresasView no definida"),

    "#/info-empresa":
      typeof EmpresasInfoView === "function"
        ? EmpresasInfoView
        : () => document.createTextNode("EmpresasInfoView no definida"),
  };

  async function render(viewFn) {
    const root = document.getElementById("view-root");
    while (root.firstChild) root.removeChild(root.firstChild);

    const view = await viewFn(); 
    root.appendChild(view);
  }

  async function router() {
    const hash = location.hash || "#/login";
    const viewFn = routes[hash] || routes["#/login"];
    await render(viewFn); 
  }

  window.addEventListener("hashchange", router);
  router();
})();
