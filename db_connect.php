<?php
// db_connect.php — conexión Oracle con OCI8
$usuario = "tienda";
$contrasena = "tienda";
$cadena = "localhost/PDBTIENDA";  // o el service_name que usás en SQL Developer

$conn = oci_connect($usuario, $contrasena, $cadena, 'AL32UTF8');
if (!$conn) {
  $e = oci_error();
  die("Error al conectar a Oracle: " . $e['message']);
}
?>