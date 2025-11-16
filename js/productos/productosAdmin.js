// js/productos/productosAdmin.js

// Asegurarse de cargar primero apiProductos.js en la vista
// <script src="../js/productos/apiProductos.js"></script>
// <script src="../js/productos/productosAdmin.js"></script>

document.addEventListener('DOMContentLoaded', () => {
    cargarProductosAdmin();

    const formProducto = document.getElementById('form-producto');
    if (formProducto) {
        formProducto.addEventListener('submit', manejarSubmitProducto);
    }
});

/**
 * Carga la lista de productos para admin (ve costos).
 */
async function cargarProductosAdmin() {
    const tbody = document.querySelector('#tabla-productos tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="8">Cargando...</td></tr>';

    try {
        const data = await apiListarProductos();

        tbody.innerHTML = '';

        data.productos.forEach(prod => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${prod.CODIGO_PRODUCTO ?? ''}</td>
                <td>${prod.NOMBRE_PRODUCTO ?? ''}</td>
                <td>${prod.DESCRIPCION ?? ''}</td>
                <td>${prod.PRECIO_COMPRA ?? ''}</td>
                <td>${prod.PRECIO_VENTA ?? ''}</td>
                <td>${prod.STOCK ?? ''}</td>
                <td>${prod.UNIDAD_MEDIDA ?? ''}</td>
                <td>${prod.ESTADO ?? ''}</td>
                <td>
                    <button type="button" class="btn-editar" data-id="${prod.ID_PRODUCTO}">Editar</button>
                    <button type="button" class="btn-estado" data-id="${prod.ID_PRODUCTO}" data-estado="${prod.ESTADO}">
                        ${prod.ESTADO === 'A' ? 'Desactivar' : 'Activar'}
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        // Eventos para botones de acción
        tbody.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                cargarProductoEnFormulario(id);
            });
        });

        tbody.querySelectorAll('.btn-estado').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const estadoActual = btn.dataset.estado;
                const nuevoEstado = estadoActual === 'A' ? 'I' : 'A';

                if (!confirm(`¿Seguro que querés ${nuevoEstado === 'A' ? 'activar' : 'desactivar'} este producto?`)) {
                    return;
                }

                try {
                    await apiCambiarEstadoProducto(id, nuevoEstado);
                    alert('Estado actualizado correctamente');
                    cargarProductosAdmin();
                } catch (err) {
                    console.error(err);
                    alert(err.message);
                }
            });
        });

    } catch (err) {
        console.error(err);
        tbody.innerHTML = '<tr><td colspan="8">Error al cargar productos</td></tr>';
        alert(err.message);
    }
}

/**
 * Rellena el formulario con los datos del producto seleccionado para edición.
 * Nota: aquí, por simplicidad, reutilizamos la lista ya cargada en la tabla.
 * En un proyecto más grande podríamos tener un endpoint "getById".
 */
function cargarProductoEnFormulario(idProducto) {
    const tbody = document.querySelector('#tabla-productos tbody');
    const form = document.getElementById('form-producto');
    if (!tbody || !form) return;

    const fila = [...tbody.querySelectorAll('tr')].find(tr => {
        const btnEditar = tr.querySelector('.btn-editar');
        return btnEditar && btnEditar.dataset.id === idProducto;
    });

    if (!fila) return;

    const celdas = fila.querySelectorAll('td');

    const inputIdProducto   = form.querySelector('input[name="id_producto"]');
    const inputCodigo       = form.querySelector('input[name="codigo_producto"]');
    const inputNombre       = form.querySelector('input[name="nombre_producto"]');
    const inputDescripcion  = form.querySelector('textarea[name="descripcion"]');
    const inputPrecioCompra = form.querySelector('input[name="precio_compra"]');
    const inputPrecioVenta  = form.querySelector('input[name="precio_venta"]');
    const inputStock        = form.querySelector('input[name="stock"]');
    const inputUnidad       = form.querySelector('input[name="unidad_medida"]');

    // Asumiendo el orden de las columnas definido arriba
    if (inputIdProducto)   inputIdProducto.value   = idProducto;
    if (inputCodigo)       inputCodigo.value       = celdas[0].innerText.trim();
    if (inputNombre)       inputNombre.value       = celdas[1].innerText.trim();
    if (inputDescripcion)  inputDescripcion.value  = celdas[2].innerText.trim();
    if (inputPrecioCompra) inputPrecioCompra.value = celdas[3].innerText.trim();
    if (inputPrecioVenta)  inputPrecioVenta.value  = celdas[4].innerText.trim();
    if (inputStock)        inputStock.value        = celdas[5].innerText.trim();
    if (inputUnidad)       inputUnidad.value       = celdas[6].innerText.trim();

    // Podés agregar scroll al form
    form.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Maneja submit del formulario de producto.
 * Si hay id_producto -> update
 * Si no, create
 */
async function manejarSubmitProducto(event) {
    event.preventDefault();
    const form = event.target;

    const formData = new FormData(form);
    const idProducto = formData.get('id_producto');

    try {
        if (idProducto) {
            // Update
            await apiActualizarProducto(formData);
            alert('Producto actualizado correctamente');
        } else {
            // Create
            await apiCrearProducto(formData);
            alert('Producto creado correctamente');
        }

        form.reset();
        const inputId = form.querySelector('input[name="id_producto"]');
        if (inputId) inputId.value = '';

        cargarProductosAdmin();
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}
