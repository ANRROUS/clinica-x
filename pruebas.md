# Pruebas de Usabilidad y Rendimiento E2E con Selenium — Clínica X

Este documento explica el funcionamiento de la suite de pruebas E2E, cómo verlas en ejecución de forma visual o a través de logs, y una breve descripción técnica de la arquitectura implementada con Selenium.

---

## 1. ¿Cómo ver las pruebas en ejecución?

### A. Ejecución Visual Local (Modo No Headless)
Por defecto, las pruebas se ejecutan en modo "headless" (sin interfaz gráfica) para ser eficientes en servidores de integración continua. Sin embargo, para ver el navegador Chrome abrirse de forma real y realizar las interacciones automáticamente ante tus ojos, haz lo siguiente:

1. Ve al archivo de configuración de variables de entorno de las pruebas en **`tests-selenium/.env`**.
2. Cambia la variable `HEADLESS` a `false`:
   ```env
   FRONTEND_URL=http://localhost:3100
   HEADLESS=false
   ```
3. Ejecuta la suite de pruebas desde la raíz:
   ```bash
   pnpm test:selenium
   ```
   *Nota: Verás cómo se abre una ventana automática de Google Chrome, se rellenan los formularios, se hace click en los botones y se mide el tiempo de respuesta automáticamente.*

---

### B. Ejecución en el Pipeline de GitHub Actions (CI/CD)
Cuando se abre un Pull Request hacia la rama `develop`, la suite se ejecuta automáticamente en la nube. Para monitorear el resultado y ver las salidas:

1. Ve a la pestaña **Actions** en tu repositorio de GitHub.
2. Selecciona la ejecución del workflow **Deploy to Railway** asociado al PR o commit en `develop`.
3. Haz click en el trabajo **🧪 Run Selenium Usability Tests**.
4. Despliega el paso **🚀 Start Services and Run E2E Selenium Tests** para visualizar los logs de la consola en tiempo real de Jest detallando el resultado de las métricas obtenidas.

---

## 2. Explicación de la Implementación con Selenium

La arquitectura de pruebas está diseñada bajo buenas prácticas de automatización:

### 1. Patrón Page Object Model (POM)
Para evitar duplicar selectores CSS y hacer el código mantenible, cada página web real se representa mediante una clase en **`tests-selenium/pages/`**:
* **`BasePage.ts`**: Contiene métodos auxiliares comunes de interacción con el navegador (esperas implícitas, clicks seguros, ingreso de texto, inyección de scripts).
* **`LoginPacientePage.ts`**, **`DoctorLoginPage.ts`**, **`AdminLoginPage.ts`**: Manejan la navegación e ingreso de credenciales para los distintos roles.
* **`AdminDashboardPage.ts`**: Interactúa con los KPIs y tablas de administración.

### 2. Extracción de Métricas de Rendimiento (Web Vitals)
Usamos la API de rendimiento nativa del navegador Chrome (`window.performance`) inyectando código JavaScript mediante el WebDriver de Selenium en `BasePage.ts`:

```typescript
const metrics = await this.driver.executeScript(`
  const timing = window.performance.timing;
  const navStart = timing.navigationStart;

  // TTFB (Time to First Byte)
  const ttfb = timing.responseStart - navStart;

  // FCP (First Contentful Paint)
  const paintEntries = window.performance.getEntriesByType('paint');
  ...
  return { ttfb, fcp, lcp, cls };
`);
```

### 3. Presupuestos y Umbrales
Jest valida los resultados devueltos por el navegador y genera un error si se exceden los límites establecidos:
* **TTFB (Tiempo al primer byte)** < 800ms
* **FCP (Primer pintado de contenido)** < 1800ms
* **LCP (Pintado del mayor elemento)** < 2500ms
* **CLS (Cambios acumulados de diseño)** < 0.1

Si el servidor responde muy lento o el navegador experimenta retrasos en el renderizado, el test falla y reporta el error con la métrica excedida.
