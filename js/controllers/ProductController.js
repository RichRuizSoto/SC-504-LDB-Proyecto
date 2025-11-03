const ProductController = {
async listar(q=''){ return API.get(`/productos/listar.php?q=${encodeURIComponent(q)}`); },
async crear(p){ return API.post('/productos/crear.php', p); },
async actualizar(p){ return API.post('/productos/actualizar.php', p); },
async eliminar(id){ return API.post('/productos/eliminar.php',{id}); }
};