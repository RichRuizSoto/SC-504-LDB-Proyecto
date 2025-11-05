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
    $stmtCheck = oci_parse($conn, "SELECT COUNT(*) AS CNT FROM usuarios WHERE usuario = :usuario OR email = :email");
    oci_bind_by_name($stmtCheck, ":usuario", $usuario);
    oci_bind_by_name($stmtCheck, ":email", $email);
    oci_execute($stmtCheck);
    $rowCheck = oci_fetch_assoc($stmtCheck);
    if ($rowCheck['CNT'] > 0) throw new Exception("Usuario o email ya existe");

    $sqlUser = "INSERT INTO usuarios (nombre, usuario, email, contrasena_hash, telefono, estado) 
                VALUES (:nombre, :usuario, :email, :pass, :telefono, 1) RETURNING id_usuario INTO :id";
    $stmt = oci_parse($conn, $sqlUser);
    oci_bind_by_name($stmt, ':nombre', $nombre);
    oci_bind_by_name($stmt, ':usuario', $usuario);
    oci_bind_by_name($stmt, ':email', $email);
    $hashed = password_hash($contrasena, PASSWORD_DEFAULT);
    oci_bind_by_name($stmt, ':pass', $hashed);
    oci_bind_by_name($stmt, ':telefono', $telefono);
    $idUsuario = 0;
    oci_bind_by_name($stmt, ':id', $idUsuario, 32);
    if (!oci_execute($stmt, OCI_NO_AUTO_COMMIT)) throw new Exception('Error al crear usuario');

    $stmtEmp = oci_parse($conn, "SELECT id_empresa FROM empresas WHERE LOWER(nombre) = LOWER(:nombre) AND estado = 1");
    oci_bind_by_name($stmtEmp, ":nombre", $empresa_nombre);
    oci_execute($stmtEmp, OCI_NO_AUTO_COMMIT);
    $rowEmp = oci_fetch_assoc($stmtEmp);
    if (!$rowEmp) throw new Exception("Empresa no encontrada");
    $id_empresa_num = $rowEmp['ID_EMPRESA'];

    $stmtRol = oci_parse($conn, "SELECT id_rol FROM roles WHERE LOWER(nombre_rol) = LOWER(:nombre) AND estado = 1");
    oci_bind_by_name($stmtRol, ":nombre", $rol_nombre);
    oci_execute($stmtRol, OCI_NO_AUTO_COMMIT);
    $rowRol = oci_fetch_assoc($stmtRol);
    if (!$rowRol) throw new Exception("Rol no encontrado");
    $id_rol_num = $rowRol['ID_ROL'];

    $sqlUE = "INSERT INTO usuarios_empresas (id_usuario, id_empresa, id_rol, fecha_asignacion)
              VALUES (:idu, :ide, :idr, SYSDATE)";
    $stmt2 = oci_parse($conn, $sqlUE);
    oci_bind_by_name($stmt2, ':idu', $idUsuario);
    oci_bind_by_name($stmt2, ':ide', $id_empresa_num);
    oci_bind_by_name($stmt2, ':idr', $id_rol_num);
    if (!oci_execute($stmt2, OCI_NO_AUTO_COMMIT)) throw new Exception('Error al asignar rol/empresa');

    oci_commit($conn);
    echo json_encode(['ok' => true]);

} catch (Exception $e) {
    oci_rollback($conn);
    echo json_encode(['ok' => false, 'msg' => $e->getMessage()]);
}
