<?php
header('Content-Type: application/json');

require_once '../models/ProductModel.php';

$model = new ProductModel();

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list':
        echo json_encode($model->getAll());
        break;

    default:
        echo json_encode(["error" => "Acción no válida"]);
        break;
}
