<?php
require_once '../../db_connect.php';
header('Content-Type: application/json');

$id_empresa = $_GET['id_empresa'] ?? null;

if (!$id_empresa) {
    echo json_encode(['error' => 'Falta id_empresa']);
    exit;
}

try {
    $sql = "
        SELECT u.id_usuario, u.nombre, u.usuario, u.email, r.nombre_rol
        FROM usuarios u
        JOIN usuarios_empresas ue ON u.id_usuario = ue.id_usuario
        JOIN roles r ON ue.id_rol = r.id_rol
        WHERE ue.id_empresa = :id
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $id_empresa);
    $stmt->execute();

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
