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
        SELECT id_producto, nombre, precio, stock, categoria
        FROM productos
        WHERE id_empresa = :id_empresa
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id_empresa', $id_empresa);
    $stmt->execute();

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
