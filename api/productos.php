<?php
header("Content-Type: application/json");
require_once "../models/ProductModel.php";

$model = new ProductModel();

$action = $_GET['action'] ?? '';

switch ($action) {
    case "list":
        $productos = $model->getAll();
        echo json_encode(["productos" => $productos]);
        break;

    default:
        echo json_encode(["error" => "Acción no válida"]);
        break;
}
