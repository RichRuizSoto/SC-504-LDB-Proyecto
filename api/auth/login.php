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
    $stid = oci_parse($conn, "BEGIN SP_GET_USUARIO(:p_ue, :p_id, :p_nombre, :p_usuario, :p_email, :p_hash, :p_encontrado); END;");
    oci_bind_by_name($stid, ':p_ue', $usuario_o_email);
    oci_bind_by_name($stid, ':p_id', $id_usuario, 32);
    oci_bind_by_name($stid, ':p_nombre', $nombre, 100);
    oci_bind_by_name($stid, ':p_usuario', $usuario, 100);
    oci_bind_by_name($stid, ':p_email', $email, 100);
    oci_bind_by_name($stid, ':p_hash', $contrasena_hash, 200);
    oci_bind_by_name($stid, ':p_encontrado', $encontrado, 1);
    oci_execute($stid);

    if ($encontrado != 1) {
        echo json_encode(['ok' => false, 'msg' => 'Usuario o email no encontrado']);
        exit;
    }

    if (!password_verify($contrasena, $contrasena_hash)) {
        echo json_encode(['ok' => false, 'msg' => 'Contraseña incorrecta']);
        exit;
    }

    $upd = oci_parse($conn, "BEGIN SP_UPDATE_ACCESO(:p_id); END;");
    oci_bind_by_name($upd, ':p_id', $id_usuario);
    oci_execute($upd);

    echo json_encode([
        'ok' => true,
        'id_usuario' => $id_usuario,
        'nombre' => $nombre,
        'usuario' => $usuario,
        'email' => $email
    ]);

} catch (Exception $e) {
    echo json_encode(['ok' => false, 'msg' => $e->getMessage()]);
}
