<?php
require_once '../../db_connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$id_usuario = $data['id_usuario'] ?? null;

if (!$id_usuario) {
    echo json_encode(['error' => 'Falta id_usuario']);
    exit;
}

try {
    $sql = "
        SELECT e.id_empresa, e.nombre, e.cedula_juridica, e.direccion, 
               e.telefono, e.email, e.logo
        FROM empresas e
        JOIN usuarios_empresas ue ON e.id_empresa = ue.id_empresa
        WHERE ue.id_usuario = :id_usuario
    ";

    $stmt = oci_parse($conn, $sql);
    oci_bind_by_name($stmt, ':id_usuario', $id_usuario);
    oci_execute($stmt);

    $empresas = [];
    while ($row = oci_fetch_assoc($stmt)) {
        // Convertir claves a minúsculas para JS
        $empresas[] = array_change_key_case($row, CASE_LOWER);
    }

    echo json_encode($empresas);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
