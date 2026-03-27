class HistorialController {
    constructor() {
        // Validar sesión antes de inicializar
        if (!this.validarSesion()) {
            this.redirigirLogin();
            return;
        }

        this.ventas = [];
        this.ventaSeleccionada = null;
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

    // Inicializar
    async init() {
        try {
            this.configurarEventos();
            this.establecerFechasDefault();
            await this.cargarVentas();
        } catch (error) {
            console.error('Error al inicializar:', error);
            this.mostrarToast('Error al cargar datos', 'error');
        }
    }

    // Configurar eventos
    configurarEventos() {
        const btnVolver = document.getElementById('btn-volver');
        const btnFiltrar = document.getElementById('btn-filtrar');
        const btnLimpiar = document.getElementById('btn-limpiar');
        const closeModal = document.getElementById('close-modal-detalle');
        
        if (btnVolver) {
            btnVolver.addEventListener('click', () => {
                window.location.href = 'ventas.html';
            });
        }

        if (btnFiltrar) {
            btnFiltrar.addEventListener('click', () => this.filtrarVentas());
        }
        
        if (btnLimpiar) {
            btnLimpiar.addEventListener('click', () => this.limpiarFiltros());
        }

        if (closeModal) {
            closeModal.addEventListener('click', () => this.cerrarModal());
        }

        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('modal-detalle');
            if (e.target === modal) {
                this.cerrarModal();
            }
        });
    }

    // Establecer fechas por defecto
    establecerFechasDefault() {
        const hoy = new Date();
        const hace30Dias = new Date();
        hace30Dias.setDate(hoy.getDate() - 30);

        const elemInicio = document.getElementById('fecha-inicio');
        const elemFin = document.getElementById('fecha-fin');

        if (elemInicio) elemInicio.valueAsDate = hace30Dias;
        if (elemFin) elemFin.valueAsDate = hoy;
    }

    // Cargar ventas
    async cargarVentas() {
        try {
            const fechaInicio = document.getElementById('fecha-inicio')?.value;
            const fechaFin = document.getElementById('fecha-fin')?.value;
            const estado = document.getElementById('filtro-estado')?.value;

            const data = await VentasService.historialVentas(fechaInicio, fechaFin, null);

            if (data.success) {
                this.ventas = data.data;

                // Filtrar por estado si se seleccionó
                if (estado) {
                    this.ventas = this.ventas.filter(v => v.ESTADO === estado);
                }

                this.mostrarVentas();
                this.calcularEstadisticas();
            } else {
                throw new Error(data.error || 'Error al cargar ventas');
            }
        } catch (error) {
            console.error('Error:', error);
            this.mostrarToast('Error al cargar ventas', 'error');
        }
    }

    // Mostrar ventas en la tabla
    mostrarVentas() {
        const tbody = document.getElementById('tbody-ventas');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.ventas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay ventas registradas</td></tr>';
            return;
        }

        this.ventas.forEach(venta => {
            const tr = document.createElement('tr');

            const estadoClass = venta.ESTADO === 'REGISTRADA' ? 'registrada' :
                venta.ESTADO === 'CANCELADA' ? 'cancelada' : 'en-proceso';

            tr.innerHTML = `
                <td>${venta.CODIGO_VENTA}</td>
                <td>${this.formatearFecha(venta.FECHA_VENTA)}</td>
                <td>${venta.NOMBRE_USUARIO}</td>
                <td>${venta.NOMBRE_CLIENTE || 'Cliente General'}</td>
                <td>${venta.METODO_PAGO || 'N/A'}</td>
                <td>₡${this.formatearMoneda(venta.TOTAL)}</td>
                <td><span class="badge ${estadoClass}">${venta.ESTADO}</span></td>
                <td>
                    <button class="btn-ver" data-id="${venta.ID_VENTA}">Ver Detalle</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        // Agregar event listeners a botones de ver detalle
        document.querySelectorAll('.btn-ver').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idVenta = parseInt(e.target.dataset.id);
                this.verDetalle(idVenta);
            });
        });
    }

    // Ver detalle de una venta
    async verDetalle(idVenta) {
        try {
            // Obtener información de la venta
            const ventaInfo = this.ventas.find(v => v.ID_VENTA === idVenta);

            // Cargar detalle
            const data = await VentasService.detalleVenta(idVenta);

            if (data.success) {
                this.mostrarModalDetalle(ventaInfo, data.data);
            } else {
                this.mostrarToast('Error al cargar detalle', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.mostrarToast('Error al cargar detalle', 'error');
        }
    }

    // Mostrar modal con detalle
    mostrarModalDetalle(venta, detalles) {
        // Información de la venta
        const elemCodigo = document.getElementById('detalle-codigo');
        const elemFecha = document.getElementById('detalle-fecha');
        const elemVendedor = document.getElementById('detalle-vendedor');
        const elemCliente = document.getElementById('detalle-cliente');
        
        if (elemCodigo) elemCodigo.textContent = venta.CODIGO_VENTA;
        if (elemFecha) elemFecha.textContent = this.formatearFecha(venta.FECHA_VENTA);
        if (elemVendedor) elemVendedor.textContent = venta.NOMBRE_USUARIO;
        if (elemCliente) elemCliente.textContent = venta.NOMBRE_CLIENTE || 'Cliente General';

        // Detalle de productos
        const tbody = document.getElementById('tbody-detalle');
        if (tbody) {
            tbody.innerHTML = '';

            let subtotal = 0;
            let descuento = 0;
            let impuesto = 0;

            detalles.forEach(det => {
                const tr = document.createElement('tr');

                // Calcular valores
                const detSubtotal = (det.CANTIDAD * det.PRECIO_UNITARIO) - (det.DESCUENTO_UNITARIO || 0);
                const detTotal = detSubtotal + (det.IMPUESTO || 0);

                tr.innerHTML = `
                    <td>${det.CODIGO_PRODUCTO}</td>
                    <td>${det.NOMBRE_PRODUCTO}</td>
                    <td>${det.CANTIDAD}</td>
                    <td>₡${this.formatearMoneda(det.PRECIO_UNITARIO)}</td>
                    <td>₡${this.formatearMoneda(det.DESCUENTO_UNITARIO || 0)}</td>
                    <td>₡${this.formatearMoneda(detSubtotal)}</td>
                    <td>₡${this.formatearMoneda(det.IMPUESTO || 0)}</td>
                    <td>₡${this.formatearMoneda(detTotal)}</td>
                `;
                tbody.appendChild(tr);

                subtotal += detSubtotal;
                descuento += parseFloat(det.DESCUENTO_UNITARIO || 0);
                impuesto += parseFloat(det.IMPUESTO || 0);
            });

            // Totales
            const total = subtotal + impuesto;

            const elemSubtotal = document.getElementById('detalle-subtotal');
            const elemDescuento = document.getElementById('detalle-descuento');
            const elemImpuesto = document.getElementById('detalle-impuesto');
            const elemTotal = document.getElementById('detalle-total');

            if (elemSubtotal) elemSubtotal.textContent = `₡${this.formatearMoneda(subtotal)}`;
            if (elemDescuento) elemDescuento.textContent = `₡${this.formatearMoneda(descuento)}`;
            if (elemImpuesto) elemImpuesto.textContent = `₡${this.formatearMoneda(impuesto)}`;
            if (elemTotal) elemTotal.textContent = `₡${this.formatearMoneda(total)}`;
        }

        // Mostrar modal
        const modal = document.getElementById('modal-detalle');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    // Cerrar modal
    cerrarModal() {
        const modal = document.getElementById('modal-detalle');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Filtrar ventas
    filtrarVentas() {
        this.cargarVentas();
    }

    // Limpiar filtros
    limpiarFiltros() {
        this.establecerFechasDefault();
        const elemEstado = document.getElementById('filtro-estado');
        if (elemEstado) elemEstado.value = '';
        this.cargarVentas();
    }

    // Calcular estadísticas
    calcularEstadisticas() {
        const totalVentas = this.ventas.length;
        const ventasRegistradas = this.ventas.filter(v => v.ESTADO === 'REGISTRADA');

        const montoTotal = ventasRegistradas.reduce((sum, v) => sum + parseFloat(v.TOTAL), 0);
        const promedio = ventasRegistradas.length > 0 ? montoTotal / ventasRegistradas.length : 0;

        const elemTotalVentas = document.getElementById('stat-total-ventas');
        const elemMontoTotal = document.getElementById('stat-monto-total');
        const elemPromedio = document.getElementById('stat-promedio');

        if (elemTotalVentas) elemTotalVentas.textContent = totalVentas;
        if (elemMontoTotal) elemMontoTotal.textContent = `₡${this.formatearMoneda(montoTotal)}`;
        if (elemPromedio) elemPromedio.textContent = `₡${this.formatearMoneda(promedio)}`;
    }

    // Utilidades
    formatearMoneda(valor) {
        return parseFloat(valor).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    formatearFecha(fecha) {
        const date = new Date(fecha);
        return date.toLocaleString('es-CR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
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
}

// Inicializar controlador
let historialController;
document.addEventListener('DOMContentLoaded', () => {
    historialController = new HistorialController();
});