# 🏥 Guía de Ejecución — Clínica X

Esta guía contiene las instrucciones necesarias para inicializar y ejecutar todo el monorepo de Clínica X de forma rápida y sencilla.

---

## 📋 Requisitos Previos
* **Node.js**: Versión `>= 20.0.0`
* **pnpm**: Versión `>= 8.0.0` (Gestor de paquetes recomendado)

---

## 🛠️ Configuración Inicial (Solo la primera vez)

1. **Instalar Dependencias** en todo el monorepo:
   ```bash
   pnpm install
   ```

2. **Generar Clientes de Prisma**:
   Genera los tipos de la base de datos para todos los microservicios:
   ```bash
   pnpm prisma:generate:all
   ```

---

## 🚀 Ejecución del Proyecto

### Opción A: Levantar Todo (Backend + Frontend Next.js)
Este comando inicia todos los microservicios y la aplicación del frontend en paralelo:
```bash
pnpm run dev
```

### Opción B: Levantar Solo el Backend (Microservicios)
Si solo deseas probar las APIs y la documentación, levanta únicamente los servicios:
```bash
pnpm run dev:services
```

---

## 🔗 Puertos y Direcciones Útiles

Toda la comunicación externa y la documentación técnica está centralizada bajo el **API Gateway** en el puerto `3000`:

* **📌 API Hub Unificado (Scalar)**: [http://localhost:3000/docs](http://localhost:3000/docs)
  > *Desde aquí puedes navegar entre las pestañas superiores para visualizar y probar interactivamente las APIs de cada microservicio:*
  > * **Autenticación** (`auth-service` en puerto interno `3005`)
  > * **Citas Médicas** (`appointment-service` en puerto interno `3001`)
  > * **Gestión Clínica** (`clinical-service` en puerto interno `3002`)
  > * **Archivos** (`file-service` en puerto interno `3003`)
  > * **Procesamiento OCR** (`ocr-service` en puerto interno `3004`)

* **💻 Aplicación Frontend (Next.js)**: [http://localhost:3100](http://localhost:3100) (o el puerto configurado en el microservicio frontend).

---

## 🔒 Autenticación en la Documentación
Para consumir los endpoints protegidos en el API Hub:
1. Inicia sesión desde el endpoint `POST /api/auth/login` (dentro de la pestaña de **Autenticación**).
2. Copia el token JWT de la respuesta.
3. Presiona el botón **Authorize** en la esquina superior derecha de la UI de Scalar y pega tu Token.
