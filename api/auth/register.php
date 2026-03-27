<?php
require_once '../../db_connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (
    !$data ||
    !isset(
        $data['nombre'],
        $data['usuario'],
        $data['email'],
        $data['contrasena'],
        $data['id_empresa'],
        $data['id_rol']
    )
) {
    echo json_encode(['ok' => false, 'msg' => 'Datos incompletos']);
    exit;
}

$nombre = $data['nombre'];
$usuario = $data['usuario'];
$email = $data['email'];
$telefono = $data['telefono'] ?? null;
$contrasena = $data['contrasena'];
$empresa_nombre = $data['id_empresa'];
$rol_nombre = $data['id_rol'];

try {
    $stmtCheck = oci_parse($conn, "BEGIN SP_CHECK_USUARIO(:usuario, :email, :existe); END;");
    oci_bind_by_name($stmtCheck, ':usuario', $usuario);
    oci_bind_by_name($stmtCheck, ':email', $email);
    oci_bind_by_name($stmtCheck, ':existe', $existe, 1);
    oci_execute($stmtCheck);

    if ($existe > 0) throw new Exception("Usuario o email ya existe");

    $hashed = password_hash($contrasena, PASSWORD_DEFAULT);
    $stmtInsert = oci_parse($conn, "BEGIN SP_INSERT_USUARIO(:nombre, :usuario, :email, :pass, :telefono, :id_usuario); END;");
    oci_bind_by_name($stmtInsert, ':nombre', $nombre);
    oci_bind_by_name($stmtInsert, ':usuario', $usuario);
    oci_bind_by_name($stmtInsert, ':email', $email);
    oci_bind_by_name($stmtInsert, ':pass', $hashed);
    oci_bind_by_name($stmtInsert, ':telefono', $telefono);
    $idUsuario = 0;
    oci_bind_by_name($stmtInsert, ':id_usuario', $idUsuario, 32);
    oci_execute($stmtInsert, OCI_NO_AUTO_COMMIT);

    $stmtEmp = oci_parse($conn, "BEGIN SP_GET_EMPRESA(:nombre, :id_empresa, :encontrada); END;");
    oci_bind_by_name($stmtEmp, ':nombre', $empresa_nombre);
    oci_bind_by_name($stmtEmp, ':id_empresa', $idEmpresa, 32);
    oci_bind_by_name($stmtEmp, ':encontrada', $empresaEncontrada, 1);
    oci_execute($stmtEmp, OCI_NO_AUTO_COMMIT);

    if ($empresaEncontrada != 1) throw new Exception("Empresa no encontrada");

    $stmtRol = oci_parse($conn, "BEGIN SP_GET_ROL(:nombre_rol, :id_rol, :encontrado); END;");
    oci_bind_by_name($stmtRol, ':nombre_rol', $rol_nombre);
    oci_bind_by_name($stmtRol, ':id_rol', $idRol, 32);
    oci_bind_by_name($stmtRol, ':encontrado', $rolEncontrado, 1);
    oci_execute($stmtRol, OCI_NO_AUTO_COMMIT);

    if ($rolEncontrado != 1) throw new Exception("Rol no encontrado");

    $stmtUE = oci_parse($conn, "BEGIN SP_ASIGNAR_USUARIO_EMPRESA(:idu, :ide, :idr); END;");
    oci_bind_by_name($stmtUE, ':idu', $idUsuario);
    oci_bind_by_name($stmtUE, ':ide', $idEmpresa);
    oci_bind_by_name($stmtUE, ':idr', $idRol);
    oci_execute($stmtUE, OCI_NO_AUTO_COMMIT);

    oci_commit($conn);
    echo json_encode(['ok' => true]);

} catch (Exception $e) {
    oci_rollback($conn);
    echo json_encode(['ok' => false, 'msg' => $e->getMessage()]);
}
