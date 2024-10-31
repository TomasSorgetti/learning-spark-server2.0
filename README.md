TODO =>
Almacenamiento de Tokens de Actualización: Los tokens de actualización se envían al cliente a través de cookies, lo cual es una práctica segura. Sin embargo, para mejorar la seguridad, sería recomendable almacenar también estos tokens en el servidor, asociados al usuario correspondiente. Esto permite invalidar los tokens de actualización en caso de que se sospeche que han sido comprometidos.

Rotación de Tokens: Implementar una rotación de tokens de actualización cada vez que se utilicen para obtener un nuevo token de acceso puede ayudar a limitar el daño en caso de que un token de actualización sea comprometido. Esto significa que cada token de actualización solo puede ser utilizado una vez, y si un atacante intercepta el token, este ya habrá sido invalidado.

Políticas de Contraseñas: Aunque el código utiliza hashPassword para asegurar las contraseñas, sería beneficioso implementar políticas de contraseñas más estrictas para asegurar que los usuarios creen contraseñas fuertes. Esto puede incluir requisitos de longitud mínima, y la inclusión de mayúsculas, minúsculas, números y símbolos.

Limitación de Intentos de Inicio de Sesión: Para proteger contra ataques de fuerza bruta, se podría implementar un sistema de limitación de intentos de inicio de sesión fallidos. Después de un cierto número de intentos fallidos, el sistema podría bloquear temporalmente el inicio de sesión desde esa cuenta o dirección IP.

Autenticación de Dos Factores (2FA): Aunque la autenticación basada en tokens es robusta, agregar una capa adicional de seguridad mediante 2FA puede proteger aún más las cuentas de usuario. Esto podría implementarse a través de aplicaciones de autenticación, mensajes SMS, o correos electrónicos.

Auditoría y Registro de Sesiones: Mantener registros detallados de las sesiones de usuario, incluyendo intentos de inicio de sesión (tanto exitosos como fallidos), puede ayudar a identificar patrones sospechosos y posibles brechas de seguridad.
