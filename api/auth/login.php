<?php
require_once '../../db_connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['usuario_o_email']) || !isset($data['contrasena'])) {
    echo json_encode(['ok' => false, 'msg' => 'Datos incompletos']);
    exit;
}

$usuario_o_email = $data['usuario_o_email'];
$contrasena = $data['contrasena'];

try {
    $sql = "SELECT id_usuario, nombre, usuario, email, contrasena_hash 
            FROM usuarios 
            WHERE usuario = :ue OR email = :ue";

    $stmt = oci_parse($conn, $sql);
    oci_bind_by_name($stmt, ':ue', $usuario_o_email);
    oci_execute($stmt);

    $row = oci_fetch_assoc($stmt);

    if (!$row) {
        echo json_encode(['ok' => false, 'msg' => 'Usuario o email no encontrado']);
        exit;
    }

    if (!password_verify($contrasena, $row['CONTRASENA_HASH'])) {
        echo json_encode(['ok' => false, 'msg' => 'Contraseña incorrecta']);
        exit;
    }

    $update = oci_parse($conn, "UPDATE usuarios SET fecha_ultimo_acceso = SYSDATE WHERE id_usuario = :id");
    oci_bind_by_name($update, ':id', $row['ID_USUARIO']);
    oci_execute($update, OCI_COMMIT_ON_SUCCESS);

    // ✅ RESPUESTA CORREGIDA (SIN ANIDAR)
    echo json_encode([
        'ok'         => true,
        'id_usuario' => $row['ID_USUARIO'],
        'nombre'     => $row['NOMBRE'],
        'usuario'    => $row['USUARIO'],
        'email'      => $row['EMAIL']
    ]);

} catch (Exception $e) {
    echo json_encode(['ok' => false, 'msg' => $e->getMessage()]);
}
