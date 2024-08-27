### Proyecto: CineCampus

## Instalar dependencias:
```
npm i
```

## Configuracion de archivo .env necesaria:

```
MONGO_URI = 'mongodb://mongo:soawdCpMSFXhGOCPwNONQAYkNWsDmliJ@junction.proxy.rlwy.net:47539/'
DB_NAME = 'cineCampus'
EXPRESS_STATIC = 'public'
EXPRESS_HOST = 'localhost'
EXPRESS_PORT = '5001'
EXPRESS_IMG = 'server/uploads'
CLOUDINARY_URL='cloudinary://849478478396893:ptne8_mL-_DznBfWuzzrs5F_sxQ@daekrtomd'
FIREBASE_SERVICE_ACCOUNT_KEY='{
  "type": "service_account",
  "project_id": "cinecampus-f0e3a",
  "private_key_id": "acb1a4447b8870827b46aafaeeb25a99212f0615",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDFGM+kl53liWYj\nyQtyMo9E0a0orQDRpnQMZ05hnT/0jJ5p+Xmoz+u4fo+LP2v6MuYQF/fT/6Y1THX2\nRaXMTdbZMS46w5dhpuG8x02xEnKxiZtOAbiS+Lrohl3MoZB6Oc6SBXa8K/Rcxjij\nzmF1q27aDjbxo8qJDbaJFNunjhtGfa0OG7j5YdjlhbNGAGpK0C6afKXo3BGeY0i1\nP7YhVMpdN26tNaCsmi5X5xy0TTdS/ToqZcfUR/9FBcjn3KWlrGF2HMlx+n2wsezY\ncf7uVUzV+bJukWHA9+No4soyc7spi1gY/wL4vlBuLlFnbd3pUJXUbuqIzKoMLHzi\nx6J58GnXAgMBAAECggEAQ7S3N7JBsmUVqjtY7DzEDH7+vddYTayhdtVSDqRHIQnh\nLURe74elUPZg9xOtUwCDGYoyPyg1/18pspTQVLN0l52WZOdlrEz4hLHuVWKh9azw\npcZfklVRV6k4tZ/WkrYi6PRpilCLHAeX02WFAzgF13BEnZOHcrc8OjDpF9DwO7E7\nrc8Np4chab/2PZHkbaEzOwkXtqN4p0WNmFkXa1osde2mlvB7dxcw1kPVhsrw3p6j\nW2ednbSm/lI0NOnRurL1hf7SOqO3sMCC8T5v0dJw8t9v6zWaeBnjq5U2tyDbnLdJ\nbRm8qQm/F+y25fprkZLG7GtzZbP/FKnUNL+fWCjgMQKBgQDx7bwEIkcM6R4FSBJ6\nyDmBbwFaNTpZqHHBSP5RYbWbv0XWUdoqwpAocUJpi3EmDLZILJ0pnGcO825I1Ehq\ntHHN+lOmDlGefCfTiphfcfRU3RRcl4ex6h5gKWWhKhRemyjbDk2WwWfug0GnQbI8\nodpFfodRU6y+rpu5cF2N0vePaQKBgQDQj4q1ARQIGHQY3SUNRiS6JzDlkYzTjNky\nNUpkDMHgti+Vx78udmAJIvXBlSGG0t1unonqvitphlRHck/wV15Y7wdqcVb+1afi\nLeSG+luAbz40I8az5vJ8iJtqactkFroFuwwZdYWd8zRz/WVIPh9aP7/S9ctAeLK9\n+3B7So5HPwKBgHJOhlhZrcJe3s1WCU00D1+liDkMDz7PhLfzeh4PkZQ+Iowp7m/n\nr9877EocFWEJ/pJJahSADn2U7RXCH1kzWtYcoatC9rNwLA0aXfYyzGPQdU9uVTHt\n0V5UEO2+CRPOMdaWgnhpd2bNY5bYRpO5UX0mVF9LrsIFlBRhEALzm/6JAoGAfB+x\n0Z/eqCLFlbanwoqoeRGyDC7fvVfqO/NzXrApAu/qyh2jLqfM6CMiWB/FYFRG7Pr1\n4ftkIt2LcyoZYVTeFdfMdhEWUXwe+oGNrLd7laifQLC6JX+heXRj6qUkI2FTPO3h\neZVz/FkuMonwqVovlqqyI3+dg7VRy7fFbdslakkCgYBQLmaN+PE/1cKvDzhqbs1K\nC6SIiJil9qkU8qIBwwDwrJ8zS1qAFmR21PjC/e45wgCEvw88HdcQ+3Qe27O0V4mj\nPnJC7H58K1Ytkq77bf80B7pJN/shu/0ipCbUUJrMjfg6KL5W/bwxCHjg8gbj9H82\nsyb2qIpIpL4JvDG+cDE5+w==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-ad7kl@cinecampus-f0e3a.iam.gserviceaccount.com",
  "client_id": "104012983393060935605",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ad7kl%40cinecampus-f0e3a.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
'
```


#### Problemtica

CineCampus es una empresa de entretenimiento que se especializa en ofrecer una experiencia de cine completa y personalizada. La empresa desea desarrollar una aplicación web que permita a los usuarios seleccionar películas, comprar boletos y asignar asientos de manera eficiente y cómoda. La aplicación también ofrecerá opciones de descuento para usuarios con tarjeta VIP y permitirá realizar compras en línea.

#### Objetivo

Desarrollar una serie de APIs para la aplicación web de CineCampus utilizando MongoDB como base de datos. Las APIs deberán gestionar la selección de películas, la compra de boletos, la asignación de asientos, y la implementación de descuentos para tarjetas VIP, con soporte para diferentes roles de usuario.

#### Requisitos Funcionales

1. **Selección de Películas:**
   - **API para Listar Películas:** Permitir la consulta de todas las películas disponibles en el catálogo, con detalles como título, género, duración y horarios de proyección.
   - **API para Obtener Detalles de Película:** Permitir la consulta de información detallada sobre una película específica, incluyendo sinopsis.
2. **Compra de Boletos:**
   - **API para Comprar Boletos:** Permitir la compra de boletos para una película específica, incluyendo la selección de la fecha y la hora de la proyección.
   - **API para Verificar Disponibilidad de Asientos:** Permitir la consulta de la disponibilidad de asientos en una sala para una proyección específica.
3. **Asignación de Asientos:**
   - **API para Reservar Asientos:** Permitir la selección y reserva de asientos para una proyección específica.
   - **API para Cancelar Reserva de Asientos:** Permitir la cancelación de una reserva de asiento ya realizada.
4. **Descuentos y Tarjetas VIP:**
   - **API para Aplicar Descuentos:** Permitir la aplicación de descuentos en la compra de boletos para usuarios con tarjeta VIP.
   - **API para Verificar Tarjeta VIP:** Permitir la verificación de la validez de una tarjeta VIP durante el proceso de compra.
5. - Roles Definidos:
     - **Administrador:** Tiene permisos completos para gestionar el sistema, incluyendo la venta de boletos en el lugar físico. Los administradores no están involucrados en las compras en línea realizadas por los usuarios.
     - **Usuario Estándar:** Puede comprar boletos en línea sin la intervención del administrador.
     - **Usuario VIP:** Puede comprar boletos en línea con descuentos aplicables para titulares de tarjetas VIP.
   - **API para Crear Usuario:** Permitir la creación de nuevos usuarios en el sistema, asignando roles y privilegios específicos (usuario estándar, usuario VIP o administrador).
   - **API para Obtener Detalles de Usuario:** Permitir la consulta de información detallada sobre un usuario, incluyendo su rol y estado de tarjeta VIP.
   - **API para Actualizar Rol de Usuario:** Permitir la actualización del rol de un usuario (por ejemplo, cambiar de usuario estándar a VIP, o viceversa).
   - **API para Listar Usuarios:** Permitir la consulta de todos los usuarios del sistema, con la posibilidad de filtrar por rol (VIP, estándar o administrador).
6. **Compras en Línea:**
   - **API para Procesar Pagos:** Permitir el procesamiento de pagos en línea para la compra de boletos.
   - **API para Confirmación de Compra:** Enviar confirmación de la compra y los detalles del boleto al usuario.

#### Requisitos Técnicos

- **Base de Datos:** Utilizar MongoDB para el almacenamiento de datos relacionados con películas, boletos, asientos, usuarios y roles.
- **Autenticación:** Implementar autenticación segura para el acceso a las APIs, utilizando roles de usuario para determinar los permisos y accesos (por ejemplo, usuarios VIP y usuarios estándar).
- **Autorización de Roles:** Asegurar que las APIs y las operaciones disponibles estén adecuadamente restringidas según el rol del usuario (por ejemplo, aplicar descuentos solo a usuarios VIP).
- **Escalabilidad:** Las APIs deben estar diseñadas para manejar un gran volumen de solicitudes concurrentes y escalar según sea necesario.
- **Documentación:** Proveer una documentación clara y completa para cada API, describiendo los endpoints, parámetros, y respuestas esperadas.

#### Entregables

1. **Código Fuente:** Repositorio en GitHub con el código de las APIs desarrolladas.
2. **Documentación de API:** Documento con la descripción detallada de cada API, incluyendo ejemplos de uso y formato de datos.
3. **Esquema de Base de Datos:** Diseño del esquema de MongoDB utilizado para almacenar la información.

#### Evaluación

- **Funcionalidad:** Cumplimiento de los requisitos funcionales establecidos.
- **Eficiencia:** Desempeño y tiempo de respuesta de las APIs.
- **Seguridad:** Implementación adecuada de medidas de seguridad, autenticación y autorización de roles.
- **Documentación:** Claridad y exhaustividad de la documentación proporcionada.