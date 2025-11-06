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
            sp_get_empresa_info(
                :id_in,
                :id_out,
                :nom,
                :ced,
                :dir,
                :tel,
                :email,
                :logo,
                :estado,
                :fecha
            );
        END;
    ");

    oci_bind_by_name($stmt, ":id_in", $id_empresa);

    oci_bind_by_name($stmt, ":id_out", $id_out, 32);
    oci_bind_by_name($stmt, ":nom", $nombre, 200);
    oci_bind_by_name($stmt, ":ced", $cedula, 50);
    oci_bind_by_name($stmt, ":dir", $direccion, 300);
    oci_bind_by_name($stmt, ":tel", $telefono, 30);
    oci_bind_by_name($stmt, ":email", $email, 200);
    oci_bind_by_name($stmt, ":logo", $logo, 500);
    oci_bind_by_name($stmt, ":estado", $estado, 32);
    oci_bind_by_name($stmt, ":fecha", $fecha, 32);

    oci_execute($stmt);

    echo json_encode([
        'id_empresa' => $id_out,
        'nombre' => $nombre,
        'cedula_juridica' => $cedula,
        'direccion' => $direccion,
        'telefono' => $telefono,
        'email' => $email,
        'logo' => $logo,
        'estado' => $estado,
        'fecha_creacion' => $fecha
    ]);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
