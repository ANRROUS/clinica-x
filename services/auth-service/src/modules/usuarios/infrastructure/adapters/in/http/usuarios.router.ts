/**
 * ============================================================================
 * Router del módulo de usuarios
 * ============================================================================
 * Mapea las rutas HTTP a los métodos del controlador.
 * ============================================================================
 */

import { Router } from 'express';
import { jwtMiddleware } from '@clinica-x/shared-middleware';
import type { UsuariosController } from './usuarios.controller';

export function createUsuariosRouter(
  controller: UsuariosController,
  jwtSecret: string,
): Router {
  const router = Router();

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Registrar un nuevo usuario en el sistema
   *     description: |
   *       ## Descripción General
   *       Crea una nueva cuenta de usuario en la clínica. Este endpoint permite que personas nuevas
   *       se registren como PACIENTE, MEDICO o ADMIN en el sistema.
   *
   *       ## Validaciones
   *       - **Email**: Debe ser un email válido y ÚNICO en el sistema
   *       - **Password**: Mínimo 8 caracteres, debe incluir mayúscula, minúscula, número
   *       - **DNI**: Debe ser único y válido para Perú (8 dígitos)
   *       - **Nombre/Apellido**: No pueden estar vacíos
   *
   *       ## Seguridad
   *       - La contraseña se almacena hasheada con bcryptjs (no en texto plano)
   *       - Se valida la fortaleza de la contraseña
   *       - No se devuelve la contraseña en la respuesta
   *
   *       ## Flujo de Uso Típico
   *       1. Usuario accede a formulario de registro
   *       2. Completa datos personales (nombre, apellido, email, DNI)
   *       3. Crea contraseña
   *       4. Sistema valida datos
   *       5. Si es válido: crea usuario y devuelve confirmación
   *       6. Usuario puede entonces hacer login
   *
   *       ## Ejemplos de Errores Comunes
   *       - Email ya registrado: `{ "message": "Email ya existe" }`
   *       - Contraseña débil: `{ "message": "Contraseña no cumple requisitos" }`
   *       - DNI inválido: `{ "message": "DNI debe tener 8 dígitos" }`
   *     tags: [Auth - Públicos]
   *     requestBody:
   *       required: true
   *       description: Datos del nuevo usuario a registrar
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password, nombre, apellido, dni]
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: paciente@clinica.com
   *                 description: Email único del usuario, usado para login
   *               password:
   *                 type: string
   *                 format: password
   *                 example: MiPassword123!
   *                 description: Mínimo 8 caracteres, mayúscula, minúscula, número
   *               nombre:
   *                 type: string
   *                 example: Ana
   *                 description: Nombre del usuario
   *               apellido:
   *                 type: string
   *                 example: García
   *                 description: Apellido del usuario
   *               dni:
   *                 type: string
   *                 example: "12345678"
   *                 description: DNI peruano (8 dígitos sin guiones)
   *               telefono:
   *                 type: string
   *                 nullable: true
   *                 example: "987654321"
   *                 description: Opcional. Teléfono de contacto
   *           example:
   *             email: ana.garcia@clinica.com
   *             password: Password123
   *             nombre: Ana
   *             apellido: García Romero
   *             dni: "12345678"
   *             telefono: "987654321"
   *     responses:
   *       201:
   *         description: Usuario registrado exitosamente. Se puede hacer login inmediatamente.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                       example: "550e8400-e29b-41d4-a716-446655440000"
   *                       description: ID único del usuario generado por el sistema
   *                     email:
   *                       type: string
   *                       example: ana.garcia@clinica.com
   *                     nombre:
   *                       type: string
   *                       example: Ana
   *                     apellido:
   *                       type: string
   *                       example: García
   *                     dni:
   *                       type: string
   *                       example: "12345678"
   *                     rol:
   *                       type: string
   *                       enum: [PACIENTE]
   *                       example: PACIENTE
   *                       description: El nuevo usuario siempre inicia como PACIENTE
   *       400:
   *         description: |
   *           Error de validación. Los datos no cumplen los requisitos.
   *
   *           Posibles errores:
   *           - Email inválido o vacío
   *           - Contraseña muy débil
   *           - DNI con formato incorrecto
   *           - Campos requeridos faltantes
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Contraseña debe tener mínimo 8 caracteres"
   *       409:
   *         description: |
   *           Conflicto: El email o DNI ya está registrado en el sistema.
   *           Pide al usuario que use otro email o haga login.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "El email ya está registrado en el sistema"
   *       500:
   *         description: Error interno del servidor
   */
  router.post('/register', controller.registrar);

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Iniciar sesión y obtener token JWT
   *     description: |
   *       ## Descripción General
   *       Autentica un usuario con email y contraseña, devolviendo un token JWT válido por 24 horas.
   *       Este token se usa para acceder a endpoints protegidos.
   *
   *       ## Proceso de Autenticación
   *       1. Usuario envía email y contraseña
   *       2. Sistema busca usuario por email
   *       3. Sistema valida la contraseña contra el hash almacenado
   *       4. Si es correcto: genera JWT con info del usuario
   *       5. Devuelve el token (cliente lo guarda en localStorage)
   *
   *       ## Token JWT Devuelto
   *       - **Formato**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   *       - **Expiración**: 24 horas (86400 segundos)
   *       - **Contiene**: userID, email, rol, timestamps
   *
   *       ## Cómo Usar el Token
   *       ```javascript
   *       // Guardar después del login
   *       localStorage.setItem('authToken', response.data.token);
   *
   *       // Usarlo en peticiones protegidas
   *       fetch('http://localhost:3000/api/auth/me', {
   *         headers: {
   *           'Authorization': 'Bearer ' + localStorage.getItem('authToken')
   *         }
   *       })
   *       ```
   *
   *       ## Errores Comunes
   *       - Email no existe en sistema → 401
   *       - Contraseña incorrecta → 401
   *       - Formato de email incorrecto → 400
   *
   *     tags: [Auth - Públicos]
   *     security: []
   *     requestBody:
   *       required: true
   *       description: Credenciales del usuario
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password]
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: paciente@clinica.com
   *                 description: Email registrado en el sistema
   *               password:
   *                 type: string
   *                 format: password
   *                 example: MiPassword123!
   *                 description: Contraseña asociada a la cuenta
   *           example:
   *             email: paciente@clinica.com
   *             password: MiPassword123!
   *     responses:
   *       200:
   *         description: |
   *           Inicio de sesión exitoso. Devuelve JWT token y datos del usuario.
   *           Guardar el token en localStorage para futuras peticiones.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     token:
   *                       type: string
   *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6InBhY2llbnRAY2xpbmljYS5jb20iLCJyb2wiOiJQQUNJRU5URSIsImlhdCI6MTcxNzg0NjQwMCwiZXhwIjoxNzE3OTMyODAwfQ.abcdefghijk..."
   *                       description: JWT válido por 24 horas
   *                     usuario:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: string
   *                           format: uuid
   *                           example: "550e8400-e29b-41d4-a716-446655440000"
   *                         email:
   *                           type: string
   *                           example: paciente@clinica.com
   *                         nombre:
   *                           type: string
   *                           example: Ana
   *                         apellido:
   *                           type: string
   *                           example: García
   *                         rol:
   *                           type: string
   *                           enum: [PACIENTE, MEDICO, ADMIN]
   *                           example: PACIENTE
   *       400:
   *         description: |
   *           Error de validación: Email o contraseña con formato incorrecto.
   *           Generalmente significa que el frontend envió datos malformados.
   *       401:
   *         description: |
   *           Credenciales inválidas:
   *           - El usuario no existe en el sistema, O
   *           - La contraseña es incorrecta
   *
   *           Por seguridad, no indicamos cuál es el problema.
   *       500:
   *         description: Error interno del servidor
   */
  router.post('/login', controller.login);

  /**
   * @swagger
   * /api/auth/forgot-password:
   *   post:
   *     summary: Solicitar email de recuperación de contraseña
   *     description: |
   *       ## Descripción General
   *       Inicia el proceso de recuperación de contraseña. Si el email existe en el sistema,
   *       se envía un email con un link para restablecer la contraseña.
   *
   *       ## Proceso
   *       1. Usuario ingresa su email
   *       2. Sistema busca si existe el usuario
   *       3. Si existe: genera token temporal y envía email
   *       4. Si no existe: devuelve OK igual (por seguridad)
   *
   *       ## Email Recibido
   *       - Contiene link con token temporal
   *       - Token válido por 24 horas
   *       - Link dirige a frontend para resetear contraseña
   *       - Ejemplo: `https://clinica-x.com/reset?token=abc123xyz`
   *
   *       ## Flujo Completo de Recuperación
   *       1. Usuario olvida contraseña
   *       2. Hace clic en "Olvide mi contraseña"
   *       3. Ingresa email → POST /forgot-password
   *       4. Recibe email con link
   *       5. Hace clic en link → abre formulario para nueva contraseña
   *       6. Ingresa nueva contraseña → POST /reset-password con token
   *       7. Contraseña actualizada, puede hacer login
   *
   *       ## Nota de Seguridad
   *       - El endpoint SIEMPRE devuelve 200 OK, incluso si el email no existe
   *       - Esto previene que alguien averigüe qué emails están registrados
   *       - Los usuarios recibirán un email si está registrado, si no, no pasará nada
   *
   *     tags: [Auth - Públicos]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email]
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: paciente@clinica.com
   *                 description: Email asociado a la cuenta (puede estar registrado o no)
   *           example:
   *             email: paciente@clinica.com
   *     responses:
   *       200:
   *         description: |
   *           Solicitud procesada. Si el email existe, se envió un email con instrucciones.
   *
   *           **Nota**: Este endpoint SIEMPRE devuelve 200 OK por motivos de seguridad,
   *           independientemente de si el email existe o no.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Si el email existe en el sistema, recibirás un correo con instrucciones"
   *       400:
   *         description: |
   *           Email requerido o formato inválido.
   */
  router.post('/forgot-password', controller.forgotPassword);

  /**
   * @swagger
   * /api/auth/reset-password:
   *   post:
   *     summary: Restablecer contraseña con token
   *     description: |
   *       ## Descripción General
   *       Finaliza el proceso de recuperación de contraseña. Requiere el token temporal
   *       enviado por email y una nueva contraseña.
   *
   *       ## Datos Requeridos
   *       - **token**: Token temporal recibido en el email (válido 24h)
   *       - **password**: Nueva contraseña que cumple requisitos
   *
   *       ## Validaciones
   *       - Token debe estar vigente (no expirado)
   *       - Token debe ser correcto
   *       - Nueva contraseña debe cumplir requisitos de seguridad
   *       - Nueva contraseña NO puede ser igual a la actual
   *
   *       ## Flujo Típico
   *       1. Usuario recibe email con token
   *       2. Hace clic en link → va a página de reset
   *       3. Ingresa nueva contraseña
   *       4. Sistema valida token y contraseña
   *       5. Si todo OK: actualiza contraseña en BD
   *       6. Usuario ya puede hacer login con nueva contraseña
   *
   *       ## Errores Posibles
   *       - Token expirado (más de 24h)
   *       - Token incorrecto o inválido
   *       - Contraseña nueva es muy débil
   *       - Contraseña nueva = contraseña anterior
   *
   *     tags: [Auth - Públicos]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [token, password]
   *             properties:
   *               token:
   *                 type: string
   *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNldFRva2VuIjoidHJ1ZSIsImlhdCI6MTcxNzg0NjQwMH0.xyz123..."
   *                 description: Token temporal recibido en el email de recuperación
   *               password:
   *                 type: string
   *                 format: password
   *                 example: NuevaPassword123!
   *                 description: Nueva contraseña (mín 8 caracteres, mayúscula, minúscula, número)
   *           example:
   *             token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *             password: NuevaPassword123!
   *     responses:
   *       200:
   *         description: |
   *           Contraseña restablecida exitosamente.
   *           El usuario ya puede hacer login con la nueva contraseña.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Contraseña restablecida. Inicia sesión con tu nueva contraseña."
   *       400:
   *         description: |
   *           Error de validación:
   *           - Token ausente o vacío
   *           - Nueva contraseña no cumple requisitos
   *           - Formato incorrecto
   *       401:
   *         description: |
   *           Token inválido o expirado:
   *           - Token no existe
   *           - Token expiró (pasaron más de 24 horas)
   *           - Token fue manipulado
   */
  router.post('/reset-password', controller.resetPassword);

  /**
   * @swagger
   * /api/auth/me:
   *   get:
   *     summary: Obtener perfil del usuario autenticado
   *     description: |
   *       ## Descripción General
   *       Devuelve los datos completos del usuario actualmente autenticado.
   *       Solo accesible con un JWT válido.
   *
   *       ## Información Devuelta
   *       - Datos personales (nombre, email, DNI)
   *       - Rol del usuario (PACIENTE, MEDICO, ADMIN)
   *       - Información de contacto
   *       - Metadatos (fecha de creación, etc.)
   *
   *       ## Uso Típico
   *       Después de hacer login, la aplicación frontend llama a este endpoint
   *       para cargar los datos del usuario en el dashboard.
   *
   *       ## Autenticación Requerida
   *       - Header: `Authorization: Bearer <JWT_TOKEN>`
   *       - El JWT se obtiene en POST /login
   *       - Token válido por 24 horas
   *
   *       ## Ejemplo de Uso en Frontend
   *       ```javascript
   *       const token = localStorage.getItem('authToken');
   *       const response = await fetch('http://localhost:3000/api/auth/me', {
   *         headers: {
   *           'Authorization': 'Bearer ' + token
   *         }
   *       });
   *       const usuario = await response.json();
   *       console.log(usuario.data);
   *       ```
   *
   *     tags: [Perfil - Protegido]
   *     responses:
   *       200:
   *         description: Datos del usuario autenticado obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                       example: "550e8400-e29b-41d4-a716-446655440000"
   *                     email:
   *                       type: string
   *                       example: paciente@clinica.com
   *                     nombre:
   *                       type: string
   *                       example: Ana
   *                     apellido:
   *                       type: string
   *                       example: García
   *                     dni:
   *                       type: string
   *                       example: "12345678"
   *                     rol:
   *                       type: string
   *                       enum: [PACIENTE, MEDICO, ADMIN]
   *                       example: PACIENTE
   *                     telefono:
   *                       type: string
   *                       nullable: true
   *                       example: "987654321"
   *       401:
   *         description: |
   *           No autorizado: Token ausente, inválido o expirado.
   *
   *           Posibles causas:
   *           - No envió header Authorization
   *           - Token es incorrecto
   *           - Token expiró (pasaron más de 24 horas desde login)
   *
   *           Solución: Hacer login nuevamente en GET /api/auth/login
   *       403:
   *         description: Token válido pero el usuario no existe
   *       500:
   *         description: Error interno del servidor
   *
   *   put:
   *     summary: Actualizar perfil del usuario autenticado
   *     description: |
   *       ## Descripción General
   *       Actualiza los datos del usuario autenticado. Solo puede actualizar sus propios datos.
   *
   *       ## Campos Actualizables
   *       - **nombre**: Nombre del usuario
   *       - **apellido**: Apellido del usuario
   *       - **telefono**: Teléfono de contacto (opcional)
   *
   *       ## Restricciones
   *       - NO se puede cambiar email (usar endpoint dedicado)
   *       - NO se puede cambiar DNI (es identificador único)
   *       - NO se puede cambiar rol (requiere admin)
   *       - Solo se pueden actualizar campos propios
   *
   *       ## Validaciones
   *       - Nombre y apellido no pueden estar vacíos
   *       - Teléfono debe ser formato válido (opcional)
   *       - Cambios se aplican inmediatamente
   *
   *       ## Flujo Típico
   *       1. Usuario va a "Editar Perfil"
   *       2. Modifica nombre, apellido o teléfono
   *       3. Hace clic en Guardar
   *       4. Frontend envía PUT /api/auth/me con datos nuevos
   *       5. Sistema valida y actualiza BD
   *       6. Devuelve usuario actualizado
   *       7. Frontend actualiza datos en pantalla
   *
   *     tags: [Perfil - Protegido]
   *     requestBody:
   *       required: true
   *       description: Datos a actualizar del usuario
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nombre:
   *                 type: string
   *                 example: Ana
   *                 description: Nuevo nombre del usuario
   *               apellido:
   *                 type: string
   *                 example: García
   *                 description: Nuevo apellido del usuario
   *               telefono:
   *                 type: string
   *                 nullable: true
   *                 example: "987654321"
   *                 description: Nuevo teléfono (opcional, puede ser null)
   *           example:
   *             nombre: Ana María
   *             apellido: García Romero
   *             telefono: "987654321"
   *     responses:
   *       200:
   *         description: Perfil actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                     email:
   *                       type: string
   *                     nombre:
   *                       type: string
   *                     apellido:
   *                       type: string
   *                     telefono:
   *                       type: string
   *                       nullable: true
   *       400:
   *         description: |
   *           Datos inválidos:
   *           - Nombre o apellido vacíos
   *           - Teléfono con formato incorrecto
   *           - Intento de cambiar campos no permitidos
   *       401:
   *         description: Token inválido, expirado o ausente
   *       403:
   *         description: Permiso denegado
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/me', jwtMiddleware({ secret: jwtSecret }), controller.me);

  router.put('/me', jwtMiddleware({ secret: jwtSecret }), controller.actualizarMe);

  // Internas
  router.get('/internal/users', jwtMiddleware({ secret: jwtSecret }), controller.listarPorIds);

  return router;
}
