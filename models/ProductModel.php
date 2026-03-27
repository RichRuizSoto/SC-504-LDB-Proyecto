<?php
require_once __DIR__ . '/../db_connect.php';

class ProductModel {

    private $conn;

    public function __construct() {
        $this->conn = conectarOracle();
    }

    public function getAll() {
        $sql = "SELECT 
                    ID_PRODUCTO,
                    CODIGO_PRODUCTO,
                    NOMBRE_PRODUCTO,
                    DESCRIPCION,
                    PRECIO_COMPRA,
                    PRECIO_VENTA,
                    STOCK,
                    UNIDAD_MEDIDA,
                    ESTADO
                FROM PRODUCTOS";

        $stmt = oci_parse($this->conn, $sql);
        oci_execute($stmt);

        $data = [];
        while ($row = oci_fetch_assoc($stmt)) {
            $data[] = $row;
        }

        return $data;
    }
}
