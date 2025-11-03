(function(){
  const $ = (s, r=document)=>r.querySelector(s);

  // Las funciones LoginView / RegisterView deben existir (globales)
  const routes = {
    '#/login':     typeof LoginView==='function'? LoginView : ()=>document.createTextNode('LoginView no definida'),
    '#/register':  typeof RegisterView==='function'? RegisterView : ()=>document.createTextNode('RegisterView no definida'),
    '#/productos': typeof ProductosView==='function'? ProductosView : ()=>document.createTextNode('ProductosView no definida')
  };

  function render(viewFn){
    const root = $('#view-root');
    if(!root){ console.error('No existe #view-root en index.html'); return; }
    root.innerHTML = '';
    root.appendChild(viewFn());
  }

  function router(){
    const hash = location.hash || '#/login';
    const viewFn = routes[hash] || routes['#/login'];
    render(viewFn);
  }

  window.addEventListener('hashchange', router);
  console.log('[app.js] router cargado');
  router(); // render inicial
})();
