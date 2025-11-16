const VentasService = {
    API_URL: 'api/ventas.php',

    // Listar productos disponibles
    async listarProductos() {
        try {
            const response = await fetch(`${this.API_URL}?action=listar_productos`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al listar productos:', error);
            throw error;
        }
    },

    // Buscar productos por nombre
    async buscarProductos(nombre) {
        try {
            const response = await fetch(`${this.API_URL}?action=buscar_productos&nombre=${encodeURIComponent(nombre)}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al buscar productos:', error);
            throw error;
        }
    },

    // Iniciar una nueva venta
    async iniciarVenta(idUsuario, idCliente, idMetodoPago) {
        try {
            const response = await fetch(`${this.API_URL}?action=iniciar_venta`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id_usuario: idUsuario,
                    id_cliente: idCliente,
                    id_metodo_pago: idMetodoPago
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al iniciar venta:', error);
            throw error;
        }
    },

    // Agregar detalle a la venta
    async agregarDetalle(idVenta, idProducto, cantidad) {
        try {
            const response = await fetch(`${this.API_URL}?action=agregar_detalle`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id_venta: idVenta,
                    id_producto: idProducto,
                    cantidad: cantidad
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al agregar detalle:', error);
            throw error;
        }
    },

    // Finalizar venta
    async finalizarVenta(idVenta, observacion = null) {
        try {
            const response = await fetch(`${this.API_URL}?action=finalizar_venta`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id_venta: idVenta,
                    observacion: observacion
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al finalizar venta:', error);
            throw error;
        }
    },

    // Cancelar venta
    async cancelarVenta(idVenta, motivo) {
        try {
            const response = await fetch(`${this.API_URL}?action=cancelar_venta`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id_venta: idVenta,
                    motivo: motivo
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al cancelar venta:', error);
            throw error;
        }
    },

    // Obtener historial de ventas
    async historialVentas(fechaInicio = null, fechaFin = null, idUsuario = null) {
        try {
            let url = `${this.API_URL}?action=historial_ventas`;
            if (fechaInicio) url += `&fecha_inicio=${fechaInicio}`;
            if (fechaFin) url += `&fecha_fin=${fechaFin}`;
            if (idUsuario) url += `&id_usuario=${idUsuario}`;

            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener historial:', error);
            throw error;
        }
    },

    // Obtener detalle de una venta
    async detalleVenta(idVenta) {
        try {
            const response = await fetch(`${this.API_URL}?action=detalle_venta&id_venta=${idVenta}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener detalle:', error);
            throw error;
        }
    },

    // Listar métodos de pago
    async listarMetodosPago() {
        try {
            const response = await fetch(`${this.API_URL}?action=listar_metodos_pago`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al listar métodos de pago:', error);
            throw error;
        }
    },

    // Listar clientes
    async listarClientes() {
        try {
            const response = await fetch(`${this.API_URL}?action=listar_clientes`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al listar clientes:', error);
            throw error;
        }
    },

    // Crear cliente rápido
    async crearCliente(nombre, cedula, telefono) {
        try {
            const response = await fetch(`${this.API_URL}?action=crear_cliente`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    nombre: nombre,
                    cedula: cedula,
                    telefono: telefono
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al crear cliente:', error);
            throw error;
        }
    },

    // Obtener ventas de hoy
    async ventasHoy() {
        try {
            const response = await fetch(`${this.API_URL}?action=ventas_hoy`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener ventas de hoy:', error);
            throw error;
        }
    }
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VentasService;
}