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
        SELECT id_empresa, nombre, cedula_juridica, direccion,
               telefono, email, logo, estado, fecha_creacion
        FROM empresas
        WHERE id_empresa = :id
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $id_empresa);
    $stmt->execute();

    $empresa = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$empresa) {
        echo json_encode(['error' => 'Empresa no encontrada']);
        exit;
    }

    echo json_encode($empresa);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
