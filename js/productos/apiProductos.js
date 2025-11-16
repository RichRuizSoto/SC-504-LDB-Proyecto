// js/productos/apiProductos.js
// Funciones reutilizables para consumir la API de productos

const API_PRODUCTOS_URL = '../api/productos.php';

async function apiListarProductos() {
    const url = `${API_PRODUCTOS_URL}?action=list`;
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    const data = await res.json();
    if (!data.success) {
        throw new Error(data.error || 'Error al listar productos');
    }
    return data;
}

async function apiCrearProducto(formData) {
    const url = `${API_PRODUCTOS_URL}?action=create`;
    const res = await fetch(url, {
        method: 'POST',
        body: formData
    });

    const data = await res.json();
    if (!data.success) {
        throw new Error(data.error || 'Error al crear producto');
    }
    return data;
}

async function apiActualizarProducto(formData) {
    const url = `${API_PRODUCTOS_URL}?action=update`;
    const res = await fetch(url, {
        method: 'POST',
        body: formData
    });

    const data = await res.json();
    if (!data.success) {
        throw new Error(data.error || 'Error al actualizar producto');
    }
    return data;
}

async function apiCambiarEstadoProducto(idProducto, nuevoEstado) {
    const url = `${API_PRODUCTOS_URL}?action=changeStatus`;
    const formData = new FormData();
    formData.append('id_producto', idProducto);
    formData.append('estado', nuevoEstado);

    const res = await fetch(url, {
        method: 'POST',
        body: formData
    });

    const data = await res.json();
    if (!data.success) {
        throw new Error(data.error || 'Error al cambiar estado del producto');
    }
    return data;
}
