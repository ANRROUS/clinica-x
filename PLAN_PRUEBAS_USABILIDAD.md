# 🧪 Plan de Pruebas Automatizadas de Usabilidad — Clínica X

Este documento define las especificaciones, escenarios de prueba (éxito/error) y métricas de usabilidad para automatizar las pruebas E2E (con Playwright o Cypress) en los flujos principales del sistema (excluyendo IA).

---

## 📐 Métricas y Medidas de Usabilidad Generales

Para cada escenario automatizado se medirán las siguientes variables:

* **Tiempo de Carga / Respuesta (LCP / API Response Time):**
  * **Excelente:** < 1.0 segundo.
  * **Aceptable:** 1.0 - 2.5 segundos.
  * **Crítico (Fallo de Usabilidad):** > 2.5 segundos.
* **Tasa de Éxito de la Tarea (Task Success Rate - TSR):** Porcentaje de usuarios/bots que completan la acción sin bloqueos (Meta: 100%).
* **Claridad en Errores (Error Visibility):** Todo caso de error debe mostrar un mensaje descriptivo y amigable en pantalla (sin código técnico expuesto ni pantallas en blanco).
* **Navegabilidad (Keyboard Navigation):** Facilidad de foco (`tabindex`), visibilidad de botones activos e inactivos.

---

## 🛡️ Módulo 1: Autenticación y Control de Acceso (Login)

### Escenario 1.1: Login de Paciente
* **Descripción:** Acceso de un paciente al sistema mediante DNI y contraseña.
* **Medidas de Usabilidad:**
  * Tiempo de respuesta de login: < 1.5s (desde el clic en ingresar hasta la redirección).
  * Foco automático en el primer campo (DNI).
* **Flujo del Test:**
  1. Ir a `/login`.
  2. Rellenar el campo DNI y Contraseña.
  3. Clic en "Ingresar".
* **Caso de Éxito:**
  * **Entrada:** DNI `99999999`, contraseña `change_this_secret`.
  * **Comportamiento Esperado:** Token JWT almacenado en `localStorage`/`cookies`, redirección automática a `/dashboard/paciente`.
* **Casos de Error:**
  * **Error A (Credenciales Incorrectas):**
    * **Entrada:** DNI correcto, contraseña incorrecta.
    * **Comportamiento Esperado:** Mensaje de alerta en rojo: *"Credenciales incorrectas"* u *"Usuario o contraseña inválidos"*. No redirecciona.
  * **Error B (DNI Inválido / Formato):**
    * **Entrada:** Letras en campo DNI (ej: `ABC12345`) o longitud incorrecta.
    * **Comportamiento Esperado:** Bloqueo visual inmediato del campo o validación nativa *"El DNI debe tener 8 dígitos numéricos"*.

### Escenario 1.2: Login de Médico / Administrador
* **Descripción:** Acceso de un médico o administrador al sistema.
* **Medidas de Usabilidad:**
  * Validación de roles en la redirección.
* **Flujo del Test:**
  1. Ir a `/login`.
  2. Ingresar credenciales del personal médico/admin.
  3. Clic en "Ingresar".
* **Caso de Éxito:**
  * **Entrada:** Credenciales válidas de rol `MEDICO` o `ADMIN`.
  * **Comportamiento Esperado:** Redirección al panel adecuado (`/dashboard/medico` o `/dashboard/admin`).
* **Caso de Error:**
  * **Error A (Intento de acceso a ruta prohibida):**
    * **Entrada:** Intentar entrar directamente a `/dashboard/admin` sin token o siendo `PACIENTE`.
    * **Comportamiento Esperado:** Redirección a `/login` o página de error `403 Forbidden` con botón para volver atrás.

---

## 📅 Módulo 2: Gestión de Citas Médicas

### Escenario 2.1: Agendar Cita Nueva
* **Descripción:** Selección de especialidad, médico, fecha y hora para agendar una cita.
* **Medidas de Usabilidad:**
  * Pasos guiados intuitivos.
  * Deshabilitación visual de horarios ocupados.
* **Flujo del Test:**
  1. Entrar a `/citas/nueva`.
  2. Seleccionar Especialidad -> Médico -> Fecha -> Hora.
  3. Confirmar reserva.
* **Caso de Éxito:**
  * **Entrada:** Selección de un horario disponible (ej: `10:00 AM`).
  * **Comportamiento Esperado:** Pantalla de confirmación con datos de la cita, botón para añadir a calendario, y tiempo de registro < 2.0s.
* **Casos de Error:**
  * **Error A (Horario Duplicado/Ocupado):**
    * **Entrada:** Intentar hacer doble clic en el botón de reservar o seleccionar un horario recién ocupado.
    * **Comportamiento Esperado:** Alerta descriptiva: *"Este horario ya ha sido reservado. Por favor, selecciona otro."* El horario se deshabilita en la interfaz.

---

## 📁 Módulo 3: Gestión de Archivos (Subida y Almacenamiento)

### Escenario 3.1: Subida de Documentos (PDF / Imágenes)
* **Descripción:** Carga de un análisis médico físico al storage desde el panel del paciente o médico.
* **Medidas de Usabilidad:**
  * Indicador visual de progreso de carga (spinner/barra).
  * Limpieza del selector de archivos tras subir.
* **Flujo del Test:**
  1. Ir a la sección de "Subir Archivo".
  2. Seleccionar un archivo del dispositivo.
  3. Hacer clic en "Subir".
* **Caso de Éxito:**
  * **Entrada:** Archivo PDF o JPG válido de `2 MB`.
  * **Comportamiento Esperado:** Mensaje de éxito: *"Archivo subido correctamente"*, previsualización del archivo o miniatura visible, estado de carga exitoso.
* **Casos de Error:**
  * **Error A (Archivo Excede el Límite de Tamaño):**
    * **Entrada:** Archivo de `15 MB` (límite máximo permitido: `10 MB`).
    * **Comportamiento Esperado:** Bloqueo de la subida antes de enviar al servidor, mostrando mensaje: *"El archivo supera el límite máximo de 10 MB"*.
  * **Error B (Tipo de Archivo No Permitido):**
    * **Entrada:** Archivo ejecutable o comprimido (ej: `archivo.zip`, `script.js`).
    * **Comportamiento Esperado:** Mensaje en pantalla: *"Formato de archivo no válido. Solo se admiten PDFs e imágenes (.jpg, .png)"*.

---

## 👁️ Módulo 4: Procesamiento OCR (Lectura Automatizada de Análisis)

### Escenario 4.1: Procesar y Extraer Datos de PDF
* **Descripción:** Extracción automática de datos estructurados de un PDF de laboratorio subido por el usuario.
* **Medidas de Usabilidad:**
  * El usuario no debe esperar inactivo: procesamiento asíncrono con estado "Procesando...".
  * Transición de estados visible en tiempo real.
* **Flujo del Test:**
  1. Subir PDF en sección OCR.
  2. Hacer clic en "Procesar con OCR".
* **Caso de Éxito:**
  * **Entrada:** PDF de análisis clínico legible.
  * **Comportamiento Esperado:** Estado inicial "PROCESANDO", y luego de unos segundos, actualización a "COMPLETADA". Los campos de texto extraídos (glucosa, colesterol, etc.) se auto-completan en la interfaz para que el usuario solo tenga que revisarlos y guardarlos.
* **Casos de Error:**
  * **Error A (PDF Ilegible / Escaneo Vacío):**
    * **Entrada:** PDF dañado, borroso o sin texto.
    * **Comportamiento Esperado:** Estado cambia a "ERROR_OCR" con mensaje descriptivo: *"No se pudo extraer información del archivo. Asegúrate de que el documento sea legible."*
