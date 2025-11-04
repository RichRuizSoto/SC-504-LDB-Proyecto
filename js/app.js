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
  };

  function render(viewFn) {
    const root = document.getElementById("view-root");
    while (root.firstChild) root.removeChild(root.firstChild);
    root.appendChild(viewFn());
  }

  function router() {
    const hash = location.hash || "#/login";
    const viewFn = routes[hash] || routes["#/login"];
    render(viewFn);
  }

  window.addEventListener("hashchange", router);
  router();
})();
