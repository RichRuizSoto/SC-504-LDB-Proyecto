<?php
$usuario = "tienda";
$contrasena = "tienda";
$cadena = "oracle/PDBTIENDA";  

$conn = oci_connect($usuario, $contrasena, $cadena, 'AL32UTF8');
if (!$conn) {
  $e = oci_error();
  die("Error al conectar a Oracle: " . $e['message']);
}
?>
