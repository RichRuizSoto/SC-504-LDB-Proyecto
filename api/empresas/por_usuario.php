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
    $stmt = oci_parse($conn, "
        BEGIN
            sp_get_empresas_por_usuario(:id_usr, :cur);
        END;
    ");

    oci_bind_by_name($stmt, ":id_usr", $id_usuario);

    $cursor = oci_new_cursor($conn);
    oci_bind_by_name($stmt, ":cur", $cursor, -1, OCI_B_CURSOR);

    oci_execute($stmt);
    oci_execute($cursor);

    $empresas = [];
    while ($row = oci_fetch_assoc($cursor)) {
        $empresas[] = array_change_key_case($row, CASE_LOWER);
    }

    echo json_encode($empresas);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
