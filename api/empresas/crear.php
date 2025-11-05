<?php
require_once '../../db_connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['empresa']) || !isset($data['usuario'])) {
    echo json_encode(['ok' => false, 'msg' => 'Datos incompletos']);
    exit;
}

$empresa = $data['empresa'];
$usuario = $data['usuario'];

if (empty($empresa['nombre']) || empty($usuario['usuario']) || empty($usuario['contrasena']) || empty($usuario['email'])) {
    echo json_encode(['ok' => false, 'msg' => 'Faltan campos requeridos']);
    exit;
}

try {
    $checkStmt = oci_parse($conn, "SELECT COUNT(*) AS CNT FROM usuarios WHERE usuario=:usuario OR email=:email");
    oci_bind_by_name($checkStmt, ':usuario', $usuario['usuario']);
    oci_bind_by_name($checkStmt, ':email', $usuario['email']);
    oci_execute($checkStmt);
    $row = oci_fetch_assoc($checkStmt);
    if ($row['CNT'] > 0) {
        echo json_encode(['ok' => false, 'msg' => 'Usuario o email ya existe']);
        exit;
    }

    $sqlEmpresa = "INSERT INTO empresas (nombre, cedula_juridica, direccion, telefono, email) 
                   VALUES (:nombre, :cedula, :direccion, :telefono, :email) RETURNING id_empresa INTO :id";
    $stmt = oci_parse($conn, $sqlEmpresa);
    oci_bind_by_name($stmt, ':nombre', $empresa['nombre']);
    oci_bind_by_name($stmt, ':cedula', $empresa['cedula_juridica']);
    oci_bind_by_name($stmt, ':direccion', $empresa['direccion']);
    oci_bind_by_name($stmt, ':telefono', $empresa['telefono']);
    oci_bind_by_name($stmt, ':email', $empresa['email']);
    $idEmpresa = 0;
    oci_bind_by_name($stmt, ':id', $idEmpresa, 32);
    if (!oci_execute($stmt, OCI_COMMIT_ON_SUCCESS)) throw new Exception('Error al crear empresa');

    $sqlUsuario = "INSERT INTO usuarios (nombre, usuario, email, telefono, contrasena_hash, estado)
                   VALUES (:nombre, :usuario, :email, :telefono, :pass, 1) RETURNING id_usuario INTO :id";
    $stmt2 = oci_parse($conn, $sqlUsuario);
    oci_bind_by_name($stmt2, ':nombre', $usuario['nombre']);
    oci_bind_by_name($stmt2, ':usuario', $usuario['usuario']);
    oci_bind_by_name($stmt2, ':email', $usuario['email']);
    oci_bind_by_name($stmt2, ':telefono', $usuario['telefono']);
    $hashed = password_hash($usuario['contrasena'], PASSWORD_DEFAULT);
    oci_bind_by_name($stmt2, ':pass', $hashed);
    $idUsuario = 0;
    oci_bind_by_name($stmt2, ':id', $idUsuario, 32);
    if (!oci_execute($stmt2, OCI_COMMIT_ON_SUCCESS)) throw new Exception('Error al crear usuario');

    $stmt3 = oci_parse($conn, "SELECT id_rol FROM roles WHERE nombre_rol='admin'");
    oci_execute($stmt3);
    $rowRol = oci_fetch_assoc($stmt3);
    if (!$rowRol) throw new Exception('Rol admin no encontrado');
    $idRol = $rowRol['ID_ROL'];

    $sqlUE = "INSERT INTO usuarios_empresas (id_usuario, id_empresa, id_rol, fecha_asignacion)
              VALUES (:idu, :ide, :idrol, SYSDATE)";
    $stmt4 = oci_parse($conn, $sqlUE);
    oci_bind_by_name($stmt4, ':idu', $idUsuario);
    oci_bind_by_name($stmt4, ':ide', $idEmpresa);
    oci_bind_by_name($stmt4, ':idrol', $idRol);
    if (!oci_execute($stmt4, OCI_COMMIT_ON_SUCCESS)) throw new Exception('Error al asignar rol admin');

    echo json_encode(['ok' => true]);
} catch (Exception $e) {
    echo json_encode(['ok' => false, 'msg' => $e->getMessage()]);
}
