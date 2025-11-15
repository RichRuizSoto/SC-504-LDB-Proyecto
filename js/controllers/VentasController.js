class VentasController {
    constructor() {
        // Validar sesión antes de inicializar
        if (!this.validarSesion()) {
            this.redirigirLogin();
            return;
        }

        this.carrito = [];
        this.ventaActual = null;
        this.productos = [];
        this.metodosPago = [];
        this.clientes = [];
        this.usuarioActual = this.obtenerUsuarioSesion();
        this.init();
    }

    // Validar si existe sesión activa
    validarSesion() {
        const idUsuario = localStorage.getItem('id_usuario');
        const nombreUsuario = localStorage.getItem('nombre');
        
        return idUsuario && nombreUsuario;
    }

    // Redirigir al login
    redirigirLogin() {
        this.mostrarToast('Debes iniciar sesión para acceder', 'error');
        setTimeout(() => {
            window.location.href = 'index.html#/login';
        }, 1500);
    }

    // Obtener usuario de sesión
    obtenerUsuarioSesion() {
        // Obtener del localStorage
        const idUsuario = localStorage.getItem('id_usuario');
        const nombreUsuario = localStorage.getItem('nombre');
        
        if (idUsuario && nombreUsuario) {
            return {
                id: parseInt(idUsuario),
                nombre: nombreUsuario
            };
        }
        
        
        return null;
    }

    // Inicializar controlador
    async init() {
        try {
            this.mostrarCargando(true);
            
            // Actualizar nombre de usuario en la vista
            const elemUsuario = document.getElementById('usuario-nombre');
            if (elemUsuario) {
                elemUsuario.textContent = this.usuarioActual.nombre;
            }

            // Cargar datos iniciales
            await this.cargarProductos();
            await this.cargarMetodosPago();
            await this.cargarClientes();

            // Configurar eventos
            this.configurarEventos();
            
            // Iniciar reloj
            this.actualizarReloj();
            setInterval(() => this.actualizarReloj(), 1000);

            this.mostrarCargando(false);
            this.mostrarToast('Sistema listo', 'success');
        } catch (error) {
            console.error('Error al inicializar:', error);
            this.mostrarToast('Error al cargar datos iniciales', 'error');
            this.mostrarCargando(false);
        }
    }

    // Configurar eventos de la interfaz
    configurarEventos() {
        // Búsqueda
        const btnSearch = document.getElementById('btn-search');
        const searchInput = document.getElementById('search-input');
        
        if (btnSearch) {
            btnSearch.addEventListener('click', () => this.buscarProductos());
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.buscarProductos();
            });
        }

        // Botones principales
        const btnFinalizar = document.getElementById('btn-finalizar');
        const btnCancelar = document.getElementById('btn-cancelar');
        const btnHistorial = document.getElementById('btn-ver-historial');
        
        if (btnFinalizar) {
            btnFinalizar.addEventListener('click', () => this.finalizarVenta());
        }
        
        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => this.cancelarVenta());
        }
        
        if (btnHistorial) {
            btnHistorial.addEventListener('click', () => {
                window.location.href = 'historial.html';
            });
        }

        // Cliente
        const btnNuevoCliente = document.getElementById('btn-nuevo-cliente');
        const closeModal = document.getElementById('close-modal-cliente');
        const formCliente = document.getElementById('form-cliente');
        
        if (btnNuevoCliente) {
            btnNuevoCliente.addEventListener('click', () => this.mostrarModalCliente());
        }
        
        if (closeModal) {
            closeModal.addEventListener('click', () => this.cerrarModal());
        }
        
        if (formCliente) {
            formCliente.addEventListener('submit', (e) => this.guardarCliente(e));
        }

        // Cerrar sesión
        const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
        if (btnCerrarSesion) {
            btnCerrarSesion.addEventListener('click', () => this.cerrarSesion());
        }

        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('modal-cliente');
            if (e.target === modal) {
                this.cerrarModal();
            }
        });
    }

    // Cargar productos disponibles
    async cargarProductos() {
        try {
            const data = await VentasService.listarProductos();
            
            if (data.success) {
                this.productos = data.data;
                this.mostrarProductos(this.productos);
            } else {
                throw new Error(data.error || 'Error al cargar productos');
            }
        } catch (error) {
            console.error('Error:', error);
            this.mostrarToast('Error al cargar productos', 'error');
        }
    }

    // Buscar productos
    async buscarProductos() {
        const nombre = document.getElementById('search-input').value.trim();
        
        if (!nombre) {
            this.mostrarProductos(this.productos);
            return;
        }

        try {
            const data = await VentasService.buscarProductos(nombre);
            
            if (data.success) {
                this.mostrarProductos(data.data);
            } else {
                throw new Error(data.error || 'Error al buscar');
            }
        } catch (error) {
            console.error('Error:', error);
            this.mostrarToast('Error al buscar productos', 'error');
        }
    }

    // Mostrar productos en la interfaz
    mostrarProductos(listaProductos) {
        const container = document.getElementById('productos-list');
        if (!container) return;
        
        container.innerHTML = '';

        if (listaProductos.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#999;">No se encontraron productos</p>';
            return;
        }

        listaProductos.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'producto-card';
            
            // Usar closure para capturar el producto
            card.addEventListener('click', () => this.agregarAlCarrito(prod));

            const stockClass = prod.STOCK < 10 ? 'bajo' : '';

            card.innerHTML = `
                <div class="producto-header">
                    <div class="producto-nombre">${prod.NOMBRE_PRODUCTO}</div>
                    <div class="producto-precio">₡${this.formatearMoneda(prod.PRECIO_VENTA)}</div>
                </div>
                <div class="producto-codigo">${prod.CODIGO_PRODUCTO}</div>
                <div class="producto-stock ${stockClass}">Stock: ${prod.STOCK} ${prod.UNIDAD_MEDIDA || 'unidades'}</div>
            `;

            container.appendChild(card);
        });
    }

    // Agregar producto al carrito
    agregarAlCarrito(producto) {
        const existe = this.carrito.find(item => item.id === producto.ID_PRODUCTO);

        if (existe) {
            if (existe.cantidad < producto.STOCK) {
                existe.cantidad++;
                existe.total = existe.cantidad * existe.precio;
            } else {
                this.mostrarToast('Stock insuficiente', 'error');
                return;
            }
        } else {
            this.carrito.push({
                id: producto.ID_PRODUCTO,
                nombre: producto.NOMBRE_PRODUCTO,
                codigo: producto.CODIGO_PRODUCTO,
                precio: parseFloat(producto.PRECIO_VENTA),
                cantidad: 1,
                stock: producto.STOCK,
                total: parseFloat(producto.PRECIO_VENTA)
            });
        }

        this.mostrarCarrito();
        this.mostrarToast('Producto agregado', 'success');
    }

    // Mostrar carrito
    mostrarCarrito() {
        const container = document.getElementById('carrito-items');
        if (!container) return;

        if (this.carrito.length === 0) {
            container.innerHTML = '<p class="carrito-vacio">El carrito está vacío</p>';
            this.actualizarResumen();
            return;
        }

        container.innerHTML = '';

        this.carrito.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'carrito-item';

            div.innerHTML = `
                <div class="carrito-item-header">
                    <span class="carrito-item-nombre">${item.nombre}</span>
                    <button class="btn-eliminar" data-index="${index}">×</button>
                </div>
                <div class="carrito-item-body">
                    <div class="cantidad-control">
                        <button class="btn-menos" data-index="${index}">-</button>
                        <input type="number" value="${item.cantidad}" min="1" max="${item.stock}" readonly>
                        <button class="btn-mas" data-index="${index}">+</button>
                    </div>
                    <span>₡${this.formatearMoneda(item.precio)}</span>
                    <span class="carrito-item-total">₡${this.formatearMoneda(item.total)}</span>
                </div>
            `;

            container.appendChild(div);
        });

        // Agregar event listeners a los botones del carrito
        this.agregarEventListenersCarrito();
        this.actualizarResumen();
    }

    // Agregar event listeners dinámicos del carrito
    agregarEventListenersCarrito() {
        // Botones eliminar
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.eliminarDelCarrito(index);
            });
        });

        // Botones menos
        document.querySelectorAll('.btn-menos').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.cambiarCantidad(index, -1);
            });
        });

        // Botones más
        document.querySelectorAll('.btn-mas').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.cambiarCantidad(index, 1);
            });
        });
    }

    // Cambiar cantidad de un producto
    cambiarCantidad(index, cambio) {
        const item = this.carrito[index];
        const nuevaCantidad = item.cantidad + cambio;

        if (nuevaCantidad > 0 && nuevaCantidad <= item.stock) {
            item.cantidad = nuevaCantidad;
            item.total = item.cantidad * item.precio;
            this.mostrarCarrito();
        } else if (nuevaCantidad > item.stock) {
            this.mostrarToast('Stock insuficiente', 'error');
        }
    }

    // Eliminar producto del carrito
    eliminarDelCarrito(index) {
        this.carrito.splice(index, 1);
        this.mostrarCarrito();
        this.mostrarToast('Producto eliminado', 'success');
    }

    // Actualizar resumen de venta
    actualizarResumen() {
        let subtotal = 0;
        let descuento = 0;

        this.carrito.forEach(item => {
            subtotal += item.total;
        });

        const impuesto = (subtotal - descuento) * 0.13; // IVA 13%
        const total = subtotal - descuento + impuesto;

        const elemSubtotal = document.getElementById('subtotal');
        const elemDescuento = document.getElementById('descuento');
        const elemImpuesto = document.getElementById('impuesto');
        const elemTotal = document.getElementById('total');

        if (elemSubtotal) elemSubtotal.textContent = `₡${this.formatearMoneda(subtotal)}`;
        if (elemDescuento) elemDescuento.textContent = `₡${this.formatearMoneda(descuento)}`;
        if (elemImpuesto) elemImpuesto.textContent = `₡${this.formatearMoneda(impuesto)}`;
        if (elemTotal) elemTotal.textContent = `₡${this.formatearMoneda(total)}`;
    }

    // Cargar métodos de pago
    async cargarMetodosPago() {
        try {
            const data = await VentasService.listarMetodosPago();

            if (data.success) {
                this.metodosPago = data.data;
                const select = document.getElementById('select-metodo-pago');

                data.data.forEach(metodo => {
                    const option = document.createElement('option');
                    option.value = metodo.ID_METODO_PAGO;
                    option.textContent = metodo.NOMBRE_METODO;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar métodos de pago:', error);
        }
    }

    // Cargar clientes
    async cargarClientes() {
        try {
            const data = await VentasService.listarClientes();

            if (data.success) {
                this.clientes = data.data;
                const select = document.getElementById('select-cliente');

                data.data.forEach(cliente => {
                    const option = document.createElement('option');
                    option.value = cliente.ID_CLIENTE;
                    option.textContent = `${cliente.NOMBRE_CLIENTE} - ${cliente.CEDULA || 'S/C'}`;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar clientes:', error);
        }
    }

    // Finalizar venta
    async finalizarVenta() {
        if (this.carrito.length === 0) {
            this.mostrarToast('El carrito está vacío', 'error');
            return;
        }

        const metodo = document.getElementById('select-metodo-pago').value;
        if (!metodo) {
            this.mostrarToast('Seleccione un método de pago', 'error');
            return;
        }

        const cliente = document.getElementById('select-cliente').value || null;

        if (!confirm('¿Confirmar la venta?')) {
            return;
        }

        try {
            this.mostrarCargando(true);

            // 1. Iniciar venta
            const dataVenta = await VentasService.iniciarVenta(
                this.usuarioActual.id,
                cliente,
                metodo
            );

            if (!dataVenta.success) {
                throw new Error(dataVenta.error);
            }

            const idVenta = dataVenta.id_venta;

            // 2. Agregar detalles
            for (const item of this.carrito) {
                const dataDetalle = await VentasService.agregarDetalle(
                    idVenta,
                    item.id,
                    item.cantidad
                );

                if (!dataDetalle.success) {
                    throw new Error(dataDetalle.error);
                }
            }

            // 3. Finalizar venta
            const dataFinalizar = await VentasService.finalizarVenta(idVenta, null);

            if (dataFinalizar.success) {
                this.mostrarToast('¡Venta registrada exitosamente!', 'success');
                this.limpiarVenta();
                await this.cargarProductos(); // Recargar productos con stock actualizado
            } else {
                throw new Error(dataFinalizar.error);
            }

        } catch (error) {
            console.error('Error al finalizar venta:', error);
            this.mostrarToast('Error al procesar la venta: ' + error.message, 'error');
        } finally {
            this.mostrarCargando(false);
        }
    }

    // Cancelar venta
    cancelarVenta() {
        if (this.carrito.length === 0) {
            this.mostrarToast('No hay venta activa', 'error');
            return;
        }

        if (confirm('¿Está seguro de cancelar esta venta?')) {
            this.limpiarVenta();
            this.mostrarToast('Venta cancelada', 'success');
        }
    }

    // Limpiar venta
    limpiarVenta() {
        this.carrito = [];
        this.ventaActual = null;
        
        const selectCliente = document.getElementById('select-cliente');
        const selectMetodo = document.getElementById('select-metodo-pago');
        const searchInput = document.getElementById('search-input');
        
        if (selectCliente) selectCliente.value = '';
        if (selectMetodo) selectMetodo.value = '';
        if (searchInput) searchInput.value = '';
        
        this.mostrarCarrito();
        this.mostrarProductos(this.productos);
    }

    // Modal cliente
    mostrarModalCliente() {
        const modal = document.getElementById('modal-cliente');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    cerrarModal() {
        const modal = document.getElementById('modal-cliente');
        const form = document.getElementById('form-cliente');
        
        if (modal) {
            modal.style.display = 'none';
        }
        
        if (form) {
            form.reset();
        }
    }

    // Guardar cliente
    async guardarCliente(e) {
        e.preventDefault();

        const nombre = document.getElementById('cliente-nombre').value;
        const cedula = document.getElementById('cliente-cedula').value;
        const telefono = document.getElementById('cliente-telefono').value;

        try {
            const data = await VentasService.crearCliente(nombre, cedula, telefono);

            if (data.success) {
                this.mostrarToast('Cliente creado exitosamente', 'success');
                this.cerrarModal();
                await this.cargarClientes();
                document.getElementById('select-cliente').value = data.id_cliente;
            } else {
                this.mostrarToast('Error al crear cliente', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.mostrarToast('Error al guardar cliente', 'error');
        }
    }

    // Cerrar sesión
    cerrarSesion() {
        if (confirm('¿Desea cerrar sesión?')) {
            sessionStorage.clear();
            window.location.href = 'index.html';
        }
    }

    // Actualizar reloj
    actualizarReloj() {
        const ahora = new Date();
        const fecha = ahora.toLocaleDateString('es-CR');
        const hora = ahora.toLocaleTimeString('es-CR');
        const elem = document.getElementById('fecha-hora');
        if (elem) {
            elem.textContent = `${fecha} ${hora}`;
        }
    }

    // Utilidades
    formatearMoneda(valor) {
        return parseFloat(valor).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    mostrarToast(mensaje, tipo = 'success') {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = mensaje;
            toast.className = `toast show ${tipo}`;

            setTimeout(() => {
                toast.className = 'toast';
            }, 3000);
        }
    }

    mostrarCargando(mostrar) {
        // Puedes implementar un loader global aquí
        if (mostrar) {
            document.body.style.cursor = 'wait';
        } else {
            document.body.style.cursor = 'default';
        }
    }
}

// Inicializar controlador cuando cargue la página
let ventasController;
document.addEventListener('DOMContentLoaded', () => {
    ventasController = new VentasController();
});