(function () {
  // const $ = (s, r = document) => r.querySelector(s);

  const safeView = (viewName, fallbackText) =>
    typeof viewName === "function"
      ? viewName
      : () => document.createTextNode(`${fallbackText} no definida`);

  const routes = {
    "#/login": safeView(LoginView, "LoginView"),
    "#/register": safeView(RegisterView, "RegisterView"),
    // "#/productos": safeView(ProductosView, "ProductosView"),
    "#/empresas": safeView(EmpresasView, "EmpresasView"),
    "#/info-empresa": safeView(EmpresasInfoView, "EmpresasInfoView"),
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
