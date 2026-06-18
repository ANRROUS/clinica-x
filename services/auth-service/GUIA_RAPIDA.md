# 🚀 Guía Rápida: Documentación API con Scalar

> **Para compañeros que necesitan usar la documentación API rápido sin complicaciones**

---

## ⚡ En 3 Pasos

### 1️⃣ Instalar dependencias

```bash
cd services/auth-service
pnpm install @scalar/express-api-reference swagger-jsdoc
pnpm add -D @types/swagger-jsdoc
```

### 2️⃣ Iniciar servidor

```bash
pnpm dev
```

### 3️⃣ Abrir documentación

Abre en el navegador:
```
http://localhost:3000/docs
```

**¡Listo!** Ya ves la documentación interactiva.

---

## 📖 Cómo Usar Scalar

### Ver un endpoint
1. Haz clic en el endpoint (ej: "Iniciar sesión")
2. Lee la descripción
3. Ve los parámetros requeridos
4. Haz clic en **"Try it"** para probar

### Probar un endpoint
1. Completa los campos necesarios
2. Haz clic en **"Send"**
3. Ve la respuesta en la derecha

### Usar token JWT
1. En la esquina superior derecha → 🔐 **Authorize**
2. Pega tu JWT token
3. Los siguientes requests incluirán el token automáticamente

---

## 📝 Agregar Documentación a tu Endpoint

### Paso 1: Escribe tu ruta

```typescript
router.post('/mi-ruta', controller.miMetodo);
```

### Paso 2: Agrega JSDoc arriba

```typescript
/**
 * @swagger
 * /api/auth/mi-ruta:
 *   post:
 *     summary: Descripción corta del endpoint
 *     description: |
 *       Descripción más larga explicando qué hace.
 *       Puedes usar markdown aquí.
 *     tags: [Mi Etiqueta]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [campo1]
 *             properties:
 *               campo1:
 *                 type: string
 *                 example: "valor de ejemplo"
 *     responses:
 *       200:
 *         description: Qué devuelve cuando funciona
 *       400:
 *         description: Qué devuelve cuando hay error
 */
router.post('/mi-ruta', controller.miMetodo);
```

### Paso 3: Recarga Scalar

Los cambios aparecen automáticamente en `http://localhost:3000/docs`

---

## 🎯 Estructura Básica del JSDoc

```yaml
@swagger
/ruta:
  metodo:           # post, get, put, delete
    summary:        # Título corto
    description:    # Descripción larga (opcional)
    tags: [Tag]     # Agrupa endpoints
    security: []    # Sin esto = requiere token
    requestBody:
      required: true/false
      content:
        application/json:
          schema:
            type: object
            properties:
              nombre_campo:
                type: string/number/boolean/etc
                example: "ejemplo"
    responses:
      200: { description: "Éxito" }
      400: { description: "Error" }
      401: { description: "Sin autorización" }
```

---

## 💡 Ejemplos Rápidos

### Endpoint público (sin token)

```typescript
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     security: []
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
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', controller.login);
```

### Endpoint protegido (con token)

```typescript
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener mi perfil
 *     tags: [Perfil]
 *     responses:
 *       200:
 *         description: Datos del usuario
 *       401:
 *         description: Token inválido o faltante
 */
router.get('/me', jwtMiddleware({ secret: jwtSecret }), controller.me);
```

---

## ⚠️ Errores Comunes

| Problema | Solución |
|----------|----------|
| Scalar no carga | ¿El servidor está en `pnpm dev`? |
| Endpoint no aparece | ¿Tiene `@swagger`? ¿Está arriba de la ruta? |
| Error en YAML | Verifica espacios (2 espacios, no tabs) |
| "No autorizado" | ¿Pegaste el token en Authorize? |

---

## 📚 Archivos Importantes

```
services/auth-service/
├── src/config/openapi.config.ts          # Config base
├── src/server.ts                          # Monta Scalar en /docs
└── src/modules/usuarios/.../usuarios.router.ts  # Endpoints documentados
```

---

## 🔗 URLs Útiles

| URL | Qué es |
|-----|--------|
| `http://localhost:3000/docs` | 📖 Documentación interactiva |
| `http://localhost:3000/openapi.json` | 📄 Spec en formato JSON |
| `http://localhost:3000/health` | ✅ Health check del servidor |

---

## ✅ Checklist Rápido

- [ ] Instalé dependencias (`pnpm install @scalar/...`)
- [ ] Servidor está corriendo (`pnpm dev`)
- [ ] Puedo acceder a `http://localhost:3000/docs`
- [ ] Veo al menos 1 endpoint documentado
- [ ] Puedo hacer "Try it" en un endpoint

---

## 📞 ¿Necesitas Ayuda?

- ¿No carga Scalar? → Revisa que el servidor esté en `pnpm dev`
- ¿No ves tu endpoint? → Recarga Scalar (F5)
- ¿Errores YAML? → Verifica indentación (2 espacios)
- ¿Token no funciona? → Click en 🔐 Authorize arriba a la derecha

---

**¡Eso es todo! La documentación se mantiene sincronizada con el código automáticamente.** 🎉
