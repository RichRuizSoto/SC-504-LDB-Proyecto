<?php
require_once '../../db_connect.php';
header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $empresa = $data['empresa'];
    $usuario = $data['usuario'];

    $hash = password_hash($usuario['contrasena'], PASSWORD_DEFAULT);

    $stmt1 = oci_parse($conn, "
        BEGIN 
            sp_crear_empresa(:n, :ced, :dir, :tel, :email, :idemp);
        END;
    ");
    oci_bind_by_name($stmt1, ":n", $empresa['nombre']);
    oci_bind_by_name($stmt1, ":ced", $empresa['cedula_juridica']);
    oci_bind_by_name($stmt1, ":dir", $empresa['direccion']);
    oci_bind_by_name($stmt1, ":tel", $empresa['telefono']);
    oci_bind_by_name($stmt1, ":email", $empresa['email']);
    oci_bind_by_name($stmt1, ":idemp", $idEmpresa, 32);
    oci_execute($stmt1);

    $stmt2 = oci_parse($conn, "
        BEGIN 
            sp_crear_usuario(:nu, :u, :eu, :tu, :hash, :idusr);
        END;
    ");
    oci_bind_by_name($stmt2, ":nu", $usuario['nombre']);
    oci_bind_by_name($stmt2, ":u", $usuario['usuario']);
    oci_bind_by_name($stmt2, ":eu", $usuario['email']);
    oci_bind_by_name($stmt2, ":tu", $usuario['telefono']);
    oci_bind_by_name($stmt2, ":hash", $hash);
    oci_bind_by_name($stmt2, ":idusr", $idUsuario, 32);
    oci_execute($stmt2);

    $stmt3 = oci_parse($conn, "BEGIN sp_get_rol_admin(:idrol); END;");
    oci_bind_by_name($stmt3, ":idrol", $idRol, 32);
    oci_execute($stmt3);

    $stmt4 = oci_parse($conn, "
        BEGIN 
            sp_asignar_usuario_empresa(:usr, :emp, :rol);
        END;
    ");
    oci_bind_by_name($stmt4, ":usr", $idUsuario);
    oci_bind_by_name($stmt4, ":emp", $idEmpresa);
    oci_bind_by_name($stmt4, ":rol", $idRol);
    oci_execute($stmt4);

    echo json_encode(['ok' => true]);

} catch (Exception $e) {
    echo json_encode(['ok' => false, 'msg' => $e->getMessage()]);
}
