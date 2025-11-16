<?php
session_start();
$_SESSION['rol'] = 'admin';      // SOLO PARA PRUEBAS
$_SESSION['id_usuario'] = 1;
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Productos - Administrador</title>
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body>

<h1>Gestión de Productos (Administrador)</h1>

<!-- Contenedor donde se mostrará la tabla -->
<div class="productos-container">
    <table id="tablaProductos">
        <thead>
            <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Nombre</th>
                <th>Precio Venta</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <!-- aquí el JS cargará los productos -->
        </tbody>
    </table>
</div>

<!-- Scripts -->
<script src="../js/productos/apiProductos.js"></script>
<script src="../js/productos/productosAdmin.js"></script>

</body>
</html>
