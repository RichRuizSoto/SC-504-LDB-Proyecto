<?php
require_once '../../db_connect.php';
header('Content-Type: application/json');

$id_empresa = $_GET['id_empresa'] ?? null;

if (!$id_empresa) {
    echo json_encode(['error' => 'Falta id_empresa']);
    exit;
}

try {
    $stmt = oci_parse($conn, "
        BEGIN 
            sp_get_usuarios_de_empresa(:id, :cur);
        END;
    ");

    oci_bind_by_name($stmt, ':id', $id_empresa);

    $cursor = oci_new_cursor($conn);
    oci_bind_by_name($stmt, ':cur', $cursor, -1, OCI_B_CURSOR);

    oci_execute($stmt);
    oci_execute($cursor);

    $usuarios = [];
    while ($row = oci_fetch_assoc($cursor)) {
        $usuarios[] = array_change_key_case($row, CASE_LOWER);
    }

    echo json_encode($usuarios);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
