FROM php:8.2-apache

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    libaio1t64 \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Descargar e instalar Oracle Instant Client
WORKDIR /opt/oracle
RUN wget https://download.oracle.com/otn_software/linux/instantclient/2113000/instantclient-basic-linux.x64-21.13.0.0.0dbru.zip && \
    wget https://download.oracle.com/otn_software/linux/instantclient/2113000/instantclient-sdk-linux.x64-21.13.0.0.0dbru.zip && \
    unzip instantclient-basic-linux.x64-21.13.0.0.0dbru.zip && \
    unzip instantclient-sdk-linux.x64-21.13.0.0.0dbru.zip && \
    rm -f instantclient-*.zip

# Configurar variables de entorno para Oracle
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_21_13:$LD_LIBRARY_PATH
ENV PATH=/opt/oracle/instantclient_21_13:$PATH

# Instalar extensiones PHP para Oracle
RUN echo 'instantclient,/opt/oracle/instantclient_21_13' | pecl install oci8-3.3.0 && \
    docker-php-ext-enable oci8

# Instalar PDO_OCI
RUN docker-php-ext-configure pdo_oci --with-pdo-oci=instantclient,/opt/oracle/instantclient_21_13,21.13 && \
    docker-php-ext-install pdo_oci

# Habilitar mod_rewrite de Apache
RUN a2enmod rewrite

# Establecer permisos
RUN chown -R www-data:www-data /var/www/html

WORKDIR /var/www/html

EXPOSE 80