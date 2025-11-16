// js/productos/productosVendedor.js

// Asegurarse de cargar primero apiProductos.js en la vista
// <script src="../js/productos/apiProductos.js"></script>
// <script src="../js/productos/productosVendedor.js"></script>

document.addEventListener('DOMContentLoaded', () => {
    cargarProductosVendedor();
});

/**
 * Carga la lista de productos para vendedor (sin precio_compra).
 */
async function cargarProductosVendedor() {
    const tbody = document.querySelector('#tabla-productos tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6">Cargando...</td></tr>';

    try {
        const data = await apiListarProductos();

        tbody.innerHTML = '';

        data.productos.forEach(prod => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${prod.CODIGO_PRODUCTO ?? ''}</td>
                <td>${prod.NOMBRE_PRODUCTO ?? ''}</td>
                <td>${prod.DESCRIPCION ?? ''}</td>
                <td>${prod.PRECIO_VENTA ?? ''}</td>
                <td>${prod.STOCK ?? ''}</td>
                <td>${prod.UNIDAD_MEDIDA ?? ''}</td>
            `;

            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
        tbody.innerHTML = '<tr><td colspan="6">Error al cargar productos</td></tr>';
        alert(err.message);
    }
}
