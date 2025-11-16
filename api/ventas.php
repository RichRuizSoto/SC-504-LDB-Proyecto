<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

//Conexión//
require_once __DIR__ . '/../db_connect.php';

$method = $_SERVER ['REQUEST_METHOD'];
$action = $GET ['action'] ?? '';

try {
    switch ($action) {
    case 'listar_productos':
        listarProductos($conn);
        break;
            
    case 'buscar_productos':
        buscarProductos($conn);
        break;
            
    case 'iniciar_venta':
        iniciarVenta($conn);
        break;
            
    case 'agregar_detalle':
        agregarDetalle($conn);
        break;
            
    case 'finalizar_venta':
        finalizarVenta($conn);
        break;
            
    case 'cancelar_venta':
        cancelarVenta($conn);
        break;
            
    case 'historial_ventas':
        historialVentas($conn);
        break;
            
    case 'detalle_venta':
        detalleVenta($conn);
        break;
            
    case 'listar_metodos_pago':
        listarMetodosPago($conn);
        break;
            
    case 'listar_clientes':
        listarClientes($conn);
        break;
            
    case 'crear_cliente':
        crearCliente($conn);
        break;
            
    case 'ventas_hoy':
        ventasHoy($conn);
        break;
            
    default:
        echo json_encode(['error' => 'Acción no válida']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e -> getMessage()]);
}

oci_close($conn);

//Funciones//
function listarProductos($conn) {
    $sql = 'BEGIN sp_listar_productos_disponibles(:cursor); END;';
    $stid = oci_parse($conn, $sql);
    
    $cursor = oci_new_cursor($conn);
    oci_bind_by_name($stid, ':cursor', $cursor, -1, OCI_B_CURSOR);
    
    oci_execute($stid);
    oci_execute($cursor);
    
    $productos = [];
    while ($row = oci_fetch_assoc($cursor)) {
        $productos[] = $row;
    }
    
    oci_free_statement($stid);
    oci_free_statement($cursor);
    
    echo json_encode(['success' => true, 'data' => $productos]);
}

function buscarProductos($conn) {
    $nombre = $_GET['nombre'] ?? '';
    
    $sql = 'BEGIN sp_buscar_productos(:nombre, :cursor); END;';
    $stid = oci_parse($conn, $sql);
    
    $cursor = oci_new_cursor($conn);
    oci_bind_by_name($stid, ':nombre', $nombre);
    oci_bind_by_name($stid, ':cursor', $cursor, -1, OCI_B_CURSOR);
    
    oci_execute($stid);
    oci_execute($cursor);
    
    $productos = [];
    while ($row = oci_fetch_assoc($cursor)) {
        $productos[] = $row;
    }
    
    oci_free_statement($stid);
    oci_free_statement($cursor);
    
    echo json_encode(['success' => true, 'data' => $productos]);
}

function iniciarVenta($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $id_usuario = $data['id_usuario'] ?? null;
    $id_cliente = $data['id_cliente'] ?? null;
    $id_metodo_pago = $data['id_metodo_pago'] ?? null;
    
    $sql = 'BEGIN sp_iniciar_venta(:id_usuario, :id_cliente, :id_metodo_pago, :id_venta); END;';
    $stid = oci_parse($conn, $sql);
    
    oci_bind_by_name($stid, ':id_usuario', $id_usuario);
    oci_bind_by_name($stid, ':id_cliente', $id_cliente);
    oci_bind_by_name($stid, ':id_metodo_pago', $id_metodo_pago);
    oci_bind_by_name($stid, ':id_venta', $id_venta, 32);
    
    if (oci_execute($stid)) {
        echo json_encode(['success' => true, 'id_venta' => $id_venta]);
    } else {
        $error = oci_error($stid);
        echo json_encode(['success' => false, 'error' => $error['message']]);
    }
    
    oci_free_statement($stid);
}

function agregarDetalle($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $id_venta = $data['id_venta'] ?? null;
    $id_producto = $data['id_producto'] ?? null;
    $cantidad = $data['cantidad'] ?? null;
    
    $sql = 'BEGIN sp_agregar_detalle_venta(:id_venta, :id_producto, :cantidad, :id_detalle); END;';
    $stid = oci_parse($conn, $sql);
    
    oci_bind_by_name($stid, ':id_venta', $id_venta);
    oci_bind_by_name($stid, ':id_producto', $id_producto);
    oci_bind_by_name($stid, ':cantidad', $cantidad);
    oci_bind_by_name($stid, ':id_detalle', $id_detalle, 32);
    
    if (oci_execute($stid)) {
        echo json_encode(['success' => true, 'id_detalle' => $id_detalle]);
    } else {
        $error = oci_error($stid);
        echo json_encode(['success' => false, 'error' => $error['message']]);
    }
    
    oci_free_statement($stid);
}

function finalizarVenta($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $id_venta = $data['id_venta'] ?? null;
    $observacion = $data['observacion'] ?? null;
    
    $sql = 'BEGIN sp_finalizar_venta(:id_venta, :observacion); END;';
    $stid = oci_parse($conn, $sql);
    
    oci_bind_by_name($stid, ':id_venta', $id_venta);
    oci_bind_by_name($stid, ':observacion', $observacion);
    
    if (oci_execute($stid)) {
        echo json_encode(['success' => true, 'message' => 'Venta finalizada']);
    } else {
        $error = oci_error($stid);
        echo json_encode(['success' => false, 'error' => $error['message']]);
    }
    
    oci_free_statement($stid);
}

function cancelarVenta($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $id_venta = $data['id_venta'] ?? null;
    $motivo = $data['motivo'] ?? 'Cancelada por usuario';
    
    $sql = 'BEGIN sp_cancelar_venta(:id_venta, :motivo); END;';
    $stid = oci_parse($conn, $sql);
    
    oci_bind_by_name($stid, ':id_venta', $id_venta);
    oci_bind_by_name($stid, ':motivo', $motivo);
    
    if (oci_execute($stid)) {
        echo json_encode(['success' => true, 'message' => 'Venta cancelada']);
    } else {
        $error = oci_error($stid);
        echo json_encode(['success' => false, 'error' => $error['message']]);
    }
    
    oci_free_statement($stid);
}

function historialVentas($conn) {
    $fecha_inicio = $_GET['fecha_inicio'] ?? null;
    $fecha_fin = $_GET['fecha_fin'] ?? null;
    $id_usuario = $_GET['id_usuario'] ?? null;
    
    $sql = 'BEGIN sp_historial_ventas(:fecha_inicio, :fecha_fin, :id_usuario, :cursor); END;';
    $stid = oci_parse($conn, $sql);
    
    $cursor = oci_new_cursor($conn);
    oci_bind_by_name($stid, ':fecha_inicio', $fecha_inicio);
    oci_bind_by_name($stid, ':fecha_fin', $fecha_fin);
    oci_bind_by_name($stid, ':id_usuario', $id_usuario);
    oci_bind_by_name($stid, ':cursor', $cursor, -1, OCI_B_CURSOR);
    
    oci_execute($stid);
    oci_execute($cursor);
    
    $ventas = [];
    while ($row = oci_fetch_assoc($cursor)) {
        $ventas[] = $row;
    }
    
    oci_free_statement($stid);
    oci_free_statement($cursor);
    
    echo json_encode(['success' => true, 'data' => $ventas]);
}

function detalleVenta($conn) {
    $id_venta = $_GET['id_venta'] ?? null;
    
    $sql = 'BEGIN sp_detalle_venta(:id_venta, :cursor); END;';
    $stid = oci_parse($conn, $sql);
    
    $cursor = oci_new_cursor($conn);
    oci_bind_by_name($stid, ':id_venta', $id_venta);
    oci_bind_by_name($stid, ':cursor', $cursor, -1, OCI_B_CURSOR);
    
    oci_execute($stid);
    oci_execute($cursor);
    
    $detalles = [];
    while ($row = oci_fetch_assoc($cursor)) {
        $detalles[] = $row;
    }
    
    oci_free_statement($stid);
    oci_free_statement($cursor);
    
    echo json_encode(['success' => true, 'data' => $detalles]);
}

function listarMetodosPago($conn) {
    $sql = 'BEGIN sp_listar_metodos_pago(:cursor); END;';
    $stid = oci_parse($conn, $sql);
    
    $cursor = oci_new_cursor($conn);
    oci_bind_by_name($stid, ':cursor', $cursor, -1, OCI_B_CURSOR);
    
    oci_execute($stid);
    oci_execute($cursor);
    
    $metodos = [];
    while ($row = oci_fetch_assoc($cursor)) {
        $metodos[] = $row;
    }
    
    oci_free_statement($stid);
    oci_free_statement($cursor);
    
    echo json_encode(['success' => true, 'data' => $metodos]);
}

function listarClientes($conn) {
    $sql = 'BEGIN sp_listar_clientes(:cursor); END;';
    $stid = oci_parse($conn, $sql);
    
    $cursor = oci_new_cursor($conn);
    oci_bind_by_name($stid, ':cursor', $cursor, -1, OCI_B_CURSOR);
    
    oci_execute($stid);
    oci_execute($cursor);
    
    $clientes = [];
    while ($row = oci_fetch_assoc($cursor)) {
        $clientes[] = $row;
    }
    
    oci_free_statement($stid);
    oci_free_statement($cursor);
    
    echo json_encode(['success' => true, 'data' => $clientes]);
}

function crearCliente($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $nombre = $data['nombre'] ?? null;
    $cedula = $data['cedula'] ?? null;
    $telefono = $data['telefono'] ?? null;
    
    $sql = 'BEGIN sp_crear_cliente_rapido(:nombre, :cedula, :telefono, :id_cliente); END;';
    $stid = oci_parse($conn, $sql);
    
    oci_bind_by_name($stid, ':nombre', $nombre);
    oci_bind_by_name($stid, ':cedula', $cedula);
    oci_bind_by_name($stid, ':telefono', $telefono);
    oci_bind_by_name($stid, ':id_cliente', $id_cliente, 32);
    
    if (oci_execute($stid)) {
        echo json_encode(['success' => true, 'id_cliente' => $id_cliente]);
    } else {
        $error = oci_error($stid);
        echo json_encode(['success' => false, 'error' => $error['message']]);
    }
    
    oci_free_statement($stid);
}

function ventasHoy($conn) {
    $sql = 'SELECT * FROM v_ventas_hoy ORDER BY fecha_venta DESC';
    $stid = oci_parse($conn, $sql);
    
    oci_execute($stid);
    
    $ventas = [];
    while ($row = oci_fetch_assoc($stid)) {
        $ventas[] = $row;
    }
    
    oci_free_statement($stid);
    
    echo json_encode(['success' => true, 'data' => $ventas]);
}
?>