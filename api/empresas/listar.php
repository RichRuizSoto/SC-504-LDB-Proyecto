<?php
require_once '../../db_connect.php';
header('Content-Type: application/json');

$sql = "SELECT id_empresa, nombre FROM empresas WHERE estado = 1";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);

$result = [];
while ($row = oci_fetch_assoc($stmt)) {
    $result[] = $row;
}

echo json_encode($result);
