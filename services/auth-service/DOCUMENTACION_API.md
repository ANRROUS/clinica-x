# 📚 Documentación API con Swagger y Scalar - Auth Service

## 📖 Introducción

Este documento explica cómo agregar y mantener la documentación interactiva de la API del **auth-service** usando **Swagger/JSDoc** y **Scalar**.

### ¿Qué es Swagger/JSDoc?
- **Swagger JSDoc**: Herramienta que genera especificaciones OpenAPI 3.0 a partir de comentarios en el código
- **Scalar**: Interfaz gráfica moderna para visualizar y probar APIs (alternativa moderna a Swagger UI)

### ¿Por qué esto es importante?
- 📌 Documentación siempre sincronizada con el código
- 🧪 Prueba endpoints directamente en el navegador
- 👥 Nuevos desarrolladores entienden rápidamente la API
- ✅ Especificación OpenAPI lista para herramientas externas (Postman, etc.)

---

## 🚀 Instalación (Paso a Paso)

### Paso 1: Navega al directorio del auth-service

```bash
cd services/auth-service
```

### Paso 2: Instala las dependencias necesarias

```bash
pnpm install @scalar/express-api-reference swagger-jsdoc
```

También instala los tipos de TypeScript para Swagger JSDoc:

```bash
pnpm add -D @types/swagger-jsdoc
```

**¿Qué hace cada paquete?**
- `@scalar/express-api-reference`: Componente Express que sirve la UI de Scalar
- `swagger-jsdoc`: Genera especificación OpenAPI desde comentarios JSDoc
- `@types/swagger-jsdoc`: Tipos TypeScript para mejor autocompletado

### Paso 3: Verifica que la instalación fue exitosa

```bash
pnpm list | grep -E "scalar|swagger-jsdoc"
```

Deberías ver:
```
├── @scalar/express-api-reference ^0.9.20
└── swagger-jsdoc ^6.3.0
```

---

## 📁 Archivos Creados/Modificados

### 1. `src/config/openapi.config.ts` (NUEVO)

**Propósito:** Configuración centralizada de la especificación OpenAPI

**Contenido:**
```typescript
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Clínica X — Auth Service API',
      version: '1.0.0',
      description: '## Autenticación\n\nTodos los endpoints...',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://clinica-x.onrender.com' 
          : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' 
          ? 'Render (Producción)' 
          : 'Local (Desarrollo)',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // Esquemas globales reutilizables
      },
    },
  },
  // Busca comentarios JSDoc en todos los routers
  apis: ['./src/modules/**/infrastructure/adapters/in/http/*.router.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
```

**¿Qué hace?**
- Define metadatos globales (título, versión, servidor)
- Configura seguridad con JWT Bearer tokens
- Indica dónde buscar comentarios JSDoc (`apis` property)
- Exporta el spec para que lo usen en el servidor

---

### 2. `src/modules/usuarios/infrastructure/adapters/in/http/usuarios.router.ts` (MODIFICADO)

**Cambios:** Se agregaron comentarios `@swagger` JSDoc encima de cada ruta

**Ejemplo de un endpoint documentado:**

```typescript
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     security: []  # Sin token requerido
 *     requestBody:
 *       required: true
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
 *               password:
 *                 type: string
 *                 format: password
 *                 example: MiPassword123!
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token con expiración de 1 día
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', controller.login);
```

**Estructura de @swagger:**
```
@swagger
/ruta:
  metodo:  (post, get, put, delete, etc.)
    summary: Descripción corta
    tags: [Etiqueta]  # Agrupa en la UI
    security: []  # Opcional, si no necesita token
    requestBody:
      required: true/false
      content:
        application/json:
          schema: { objeto OpenAPI }
    responses:
      CODIGO:
        description: Qué significa
```

---

### 3. `src/server.ts` (MODIFICADO)

**Cambios:**
1. Importar `swaggerSpec`
2. Crear endpoint `/openapi.json` que sirva la especificación
3. Crear endpoint `/docs` que sirva Scalar UI
4. Desabilitar CSP en helmet para permitir scripts de CDN

**Código agregado:**

```typescript
import { swaggerSpec } from './config/openapi.config';

// ... middlewares ...

app.use(helmet({
  contentSecurityPolicy: false,  // Permite CDN de Scalar
}));

// Endpoint que sirve el spec en JSON
app.get('/openapi.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerSpec);
});

// Endpoint que sirve Scalar UI
app.get('/docs', (_req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>Clínica X — Auth Service API</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <script
      id="api-reference"
      data-url="/openapi.json"
    ></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`);
});
```

---

## ✅ Cómo Probar

### 1. Inicia el servidor en desarrollo

```bash
cd services/auth-service
pnpm dev
```

Deberías ver:
```
🔐 auth-service escuchando en http://localhost:3000
```

### 2. Abre en el navegador

```
http://localhost:3000/docs
```

### 3. Verifica que funciona

✅ Deberías ver:
- Título: "Clínica X — Auth Service API"
- Lista de endpoints en la izquierda
- Para cada endpoint:
  - Descripción
  - Parámetros requeridos
  - Ejemplos
  - Códigos de respuesta

✅ Prueba un endpoint:
1. Haz clic en "POST /api/auth/login"
2. Haz clic en "Try it"
3. Completa email y password
4. Presiona "Send"
5. Verás la respuesta del servidor

---

## 📝 Cómo Agregar Documentación a Nuevos Endpoints

### Paso 1: Escribe tu ruta

```typescript
router.post('/cambiar-email', controller.cambiarEmail);
```

### Paso 2: Agrega el comentario JSDoc ARRIBA de la ruta

```typescript
/**
 * @swagger
 * /api/auth/cambiar-email:
 *   post:
 *     summary: Cambiar email del usuario
 *     tags: [Perfil]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nuevoEmail]
 *             properties:
 *               nuevoEmail:
 *                 type: string
 *                 format: email
 *                 example: newemail@clinica.com
 *     responses:
 *       200:
 *         description: Email actualizado
 *       400:
 *         description: Email inválido
 *       409:
 *         description: Email ya en uso
 */
router.post('/cambiar-email', controller.cambiarEmail);
```

### Paso 3: Recarga Scalar

Los cambios se reflejan automáticamente en `http://localhost:3000/docs`

---

## 🔐 Documentación de Endpoints Protegidos (con JWT)

Para endpoints que requieren autenticación, **NO agreguees `security: []`**:

```typescript
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener perfil del usuario
 *     tags: [Perfil]
 *     # SIN security: [] = requiere token
 *     responses:
 *       200:
 *         description: Datos del usuario
 *       401:
 *         description: No autorizado
 */
router.get('/me', jwtMiddleware({ secret: jwtSecret }), controller.me);
```

**Cómo Scalar sabe que necesita token:**
1. En la esquina superior derecha de Scalar, hay un botón 🔐 "Authorize"
2. El usuario pega su JWT
3. Todas las peticiones después incluyen el header `Authorization: Bearer <token>`

---

## 📚 Esquemas Reutilizables

Si quieres reutilizar esquemas (para no repetir código):

### 1. Agrégalos en `openapi.config.ts`

```typescript
components: {
  schemas: {
    Usuario: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        nombre: { type: 'string' },
        email: { type: 'string', format: 'email' },
        rol: { 
          type: 'string', 
          enum: ['PACIENTE', 'MEDICO', 'ADMIN'] 
        },
      },
    },
  },
},
```

### 2. Úsalos en los JSDoc

```typescript
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'  # Referencia
 */
```

---

## 🐛 Troubleshooting

### Problema: "Página en blanco"

**Soluciones:**
1. ¿El servidor está corriendo? `pnpm dev`
2. ¿La URL es correcta? `http://localhost:3000/docs` (NO `/docs/`)
3. Abre la consola (F12) y busca errores
4. Verifica que `/openapi.json` devuelve JSON válido

### Problema: "Endpoint no aparece en Scalar"

**Soluciones:**
1. ¿El archivo está en la ruta configurada en `openapi.config.ts`?
   - Debe estar en: `src/modules/**/infrastructure/adapters/in/http/*.router.ts`
2. ¿El comentario tiene `@swagger`?
3. ¿Está ARRIBA de la ruta (antes de `router.post(...)`, etc.)?
4. ¿La indentación YAML es correcta? (2 espacios, no tabs)

### Problema: "Errores de validez en el JSDoc"

**Soluciones:**
1. Valida el YAML en línea: https://jsonschema.dev/
2. Compara con ejemplos en el PDF (sección 6.1)
3. Verifica que `type` sea válido: `string`, `object`, `array`, `number`, etc.

### Problema: "CSP errors en consola"

**Ya está resuelto** en el código, pero si aparecen nuevamente:
- En `server.ts`, verifica: `contentSecurityPolicy: false`

---

## 📖 Endpoints Documentados en Auth Service

### Públicos (sin token)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registrarse |
| POST | `/api/auth/forgot-password` | Solicitar recuperación |
| POST | `/api/auth/reset-password` | Restablecer contraseña |

### Protegidos (con token JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/auth/me` | Obtener perfil |
| PUT | `/api/auth/me` | Actualizar perfil |

---

## 🔗 Referencias

### Recursos en el PDF
- **Sección 6.1:** Ejemplos completos de JSDoc para Auth Service
- **Sección 5.2:** Configuración de openapi.config.ts
- **Sección 5.3:** Montaje de Scalar en Express

### Documentación Oficial
- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger JSDoc Docs](https://github.com/Surnet/swagger-jsdoc)
- [Scalar Documentation](https://scalar.com/docs)

### Ejemplos de otros microservicios
- Appointment Service (`:3001`)
- Clinical Service (`:3002`)
- File Service (`:3003`)

---

## 📋 Checklist para Pull Request

Antes de hacer push, verifica:

- [ ] `pnpm install @scalar/express-api-reference swagger-jsdoc`
- [ ] Archivo `src/config/openapi.config.ts` creado
- [ ] Archivo `src/modules/usuarios/infrastructure/adapters/in/http/usuarios.router.ts` con JSDoc
- [ ] Archivo `src/server.ts` modificado con endpoints `/docs` y `/openapi.json`
- [ ] `pnpm dev` funciona sin errores
- [ ] `http://localhost:3000/docs` carga correctamente
- [ ] Al menos 1 endpoint aparece en Scalar
- [ ] Puedo hacer "Try it" en un endpoint

---

## 💡 Tips y Mejores Prácticas

### 1. Mantén el código y docs sincronizados
- Si cambias un endpoint, actualiza el JSDoc
- Si agregar un parámetro, actualiza el schema

### 2. Usa ejemplos realistas
```typescript
example: 'paciente@clinica.com'  // ✅ Bueno
example: 'test'                   // ❌ Poco útil
```

### 3. Describe qué hace, no cómo lo hace
```typescript
summary: 'Obtener perfil del usuario'  // ✅
summary: 'SELECT usuario FROM db'      // ❌
```

### 4. Documenta los códigos de error
```typescript
responses:
  200: { description: 'Éxito' }
  400: { description: 'Email inválido' }
  409: { description: 'Email ya en uso' }
  500: { description: 'Error interno del servidor' }
```

### 5. Usa tags para organizar
```typescript
tags: [Auth]    # Agrupa endpoints en la UI
tags: [Perfil]
tags: [Admin]
```

---

## 🚀 Próximos Pasos (Futuro)

Para los otros microservicios:
1. Copiar la estructura de este README
2. Adaptar `openapi.config.ts` para cada servicio
3. Agregar JSDoc en los routers correspondientes
4. Montar Scalar en `/docs` de cada servicio

**Resultado final:**
```
http://localhost:8080/docs → API Gateway
http://localhost:3000/docs → Auth Service ✅
http://localhost:3001/docs → Appointment Service
http://localhost:3002/docs → Clinical Service
http://localhost:3003/docs → File Service
```

---

## ❓ Preguntas Frecuentes

**P: ¿Necesito compilar después de cambiar JSDoc?**
A: No, tsx compila on-the-fly. Solo recarga `http://localhost:3000/docs`

**P: ¿Puedo documentar endpoints privados/internos?**
A: Sí, pero usa `tags: [Internal]` para distinguirlos

**P: ¿Cómo comparto la documentación con frontend?**
A: Comparte el URL `http://localhost:3000/docs` o exporta el spec con:
```bash
curl http://localhost:3000/openapi.json > openapi.json
```

**P: ¿Qué pasa si olvido el JSDoc en un endpoint?**
A: El endpoint funciona pero no aparece en Scalar. Es buena práctica documentar TODO

---

**Última actualización:** Junio 2026  
**Responsable:** Documentación API - Clínica X  
**Estado:** ✅ Completado
