<?php
// Configuración desde variables de entorno (Docker)
$usuario = getenv('ORACLE_USER') ?: 'tienda';
$contrasena = getenv('ORACLE_PASSWORD') ?: 'tienda';
$host = getenv('ORACLE_HOST') ?: 'oracle';
$port = getenv('ORACLE_PORT') ?: '1521';
$service = getenv('ORACLE_SERVICE') ?: 'PDBTIENDA';

$cadena = "{$host}:{$port}/{$service}";

$conn = oci_connect($usuario, $contrasena, $cadena, 'AL32UTF8');

if (!$conn) {
    $e = oci_error();
    die("Error al conectar a Oracle: " . $e['message']);
}
?>