# Tests Selenium — Clínica X

Suite de tests E2E automatizados con Selenium WebDriver 4.x + TypeScript + Jest.

---

## Archivos modificados en el proyecto existente

| Archivo | Cambio |
|---|---|
| `pnpm-workspace.yaml` | Agregado `- 'tests-selenium'` al workspace |
| `package.json` (raíz) | Agregados 4 scripts `test:selenium*` |

---

## Estructura creada

```
tests-selenium/
├── pages/
│   ├── BasePage.ts              — helpers base: wait, navigate, clearAndType
│   ├── LoginPacientePage.ts     — /login (DNI + email + password)
│   ├── RegisterPage.ts          — /register (nombre, apellido, dni, email, password)
│   ├── ReservarCitaPage.ts      — /reservar-cita (manual + automático)
│   ├── DoctorLoginPage.ts       — /doctor/login (email + password)
│   ├── DoctorPacientesPage.ts   — /doctor/pacientes (consulta activa, análisis, medicación)
│   ├── AdminLoginPage.ts        — /admin/login (email + password)
│   ├── AdminDashboardPage.ts    — /admin/dashboard (KPIs, tabla médicos)
│   └── AdminDoctorFormPage.ts   — /admin/doctors/new y /edit (formulario médico)
├── tests/
│   ├── flujo-paciente.test.ts   — 4 casos: login, registro, reserva manual, reserva automática
│   ├── flujo-medico.test.ts     — 5 casos: login, consulta activa, análisis, medicación, finalizar
│   └── flujo-admin.test.ts      — 4 casos: login, dashboard KPIs, crear doctor, editar doctor
├── utils/
│   ├── driver.ts                — buildDriver() con opciones headless/chrome
│   └── credentials.ts           — credenciales demo y URLs centralizadas
├── package.json
├── tsconfig.json
├── jest.config.ts
└── .env.example
```

---

## Correcciones aplicadas vs. prompt original

| # | Problema en prompt | Solución aplicada |
|---|---|---|
| 1 | `setupFilesAfterFramework` (typo) | Cambiado a `setupFilesAfterEnv` (nombre real en Jest) |
| 2 | `tsconfig.json` heredaba `exclude: ["**/*.test.ts"]` del base | Sobreescrito `exclude` en tests-selenium para incluir archivos `.test.ts` |
| 3 | Register en prompt: 4 campos (dni, email, pass, confirmPass) | Formulario real tiene 7 campos: `nombre`, `apellido`, `dni`, `telefono`, `email`, `password`, `confirmPassword` |
| 4 | Auto-booking: prompt esperaba modal de confirmación | Código real hace redirect directo a `/perfil` sin modal. Test ajustado. |
| 5 | Doctor login: prompt mencionaba posible DNI | Confirmado: solo `email` + `password` |

---

## Selectores usados (verificados contra el código fuente)

### Login paciente (`/login`)
```
input[name="dni"]
input[name="email"]
input[name="password"]
button[type="submit"]
```

### Registro (`/register`)
```
input[name="nombre"]
input[name="apellido"]
input[name="dni"]
input[name="telefono"]   (opcional)
input[name="email"]
input[name="password"]
input[name="confirmPassword"]
button[type="submit"]
```

### Login médico y admin
```
input[name="email"]
input[name="password"]
button[type="submit"]
```

### Reservar cita
- **Especialidades**: `aside button` (primer botón no seleccionado)
- **Botón automático**: `//button[contains(text(), 'Automático')]`
- **Días**: `button:not([disabled])` dentro del contenedor de días
- **Slots**: `button:not([disabled])` dentro del grid de slots
- **Confirmar Reserva**: `//button[contains(text(), 'Confirmar Reserva')]`
- **Modal Aceptar**: `//button[contains(text(), 'Aceptar')]`

### Admin dashboard
- **KPI cards**: `div.grid.grid-cols-4 > div` (4 elementos)
- **Filas tabla**: `tbody tr`
- **Nuevo Doctor**: `//a[contains(text(), 'Nuevo Doctor')]`
- **Editar médico (ícono lápiz)**: `tr td a[href*="/edit"]`

### Formulario médico admin
```
input[name="nombre"]
input[name="apellido"]
input[name="dni"]
input[name="email"]
input[name="telefono"]
input[name="username"]
select[name="specialtyId"]
input[name="shift"][value="MANANA"]
input[name="password"]
//button[contains(text(), 'Guardar cambios')]
```

---

## Prerequisitos para ejecutar

```bash
# 1. Tener los 5 servicios + frontend corriendo
pnpm dev

# 2. Correr el seed de datos demo
pnpm seed:demo

# 3. Instalar dependencias del workspace de tests
pnpm install

# 4. Copiar y configurar env
cp tests-selenium/.env.example tests-selenium/.env
```

---

## Comandos de ejecución

```bash
# Todos los flujos
pnpm test:selenium

# Por flujo individual
pnpm test:selenium:paciente
pnpm test:selenium:medico
pnpm test:selenium:admin
```

---

## Tabla de tests implementados

| Suite | Test | Verifica |
|---|---|---|
| flujo-paciente | 1.1 Login paciente | Redirect a `/perfil` |
| flujo-paciente | 1.2 Registro nuevo paciente | Redirect a `/perfil` tras crear cuenta |
| flujo-paciente | 1.3 Reserva manual | Toast éxito o redirect a `/perfil` |
| flujo-paciente | 1.4 Reserva automática | Redirect directo a `/perfil` (sin modal) |
| flujo-medico | 2.1 Login médico | Redirect a `/doctor/calendario` |
| flujo-medico | 2.2 Abrir consulta activa | Tab "Consulta Actual" visible |
| flujo-medico | 2.3 Agregar análisis clínico | Chip "Hemograma completo" en UI |
| flujo-medico | 2.4 Agregar medicación | Fila "Paracetamol" en tabla |
| flujo-medico | 2.5 Finalizar consulta | Toast éxito o redirect al calendario |
| flujo-admin | 3.1 Login admin | Redirect a `/admin/dashboard` |
| flujo-admin | 3.2 Dashboard KPIs | 4 cards visibles + tabla con filas |
| flujo-admin | 3.3 Agregar nuevo doctor | Redirect a dashboard tras guardar |
| flujo-admin | 3.4 Editar doctor | Redirect a dashboard tras guardar |

---

## Notas importantes

- **Headless mode**: controlado por variable `HEADLESS=true/false` en `.env`
- **ChromeDriver**: Selenium 4.6+ incluye Selenium Manager, se descarga automáticamente
- **Timeouts**: 60s por test (Jest), 10s por elemento (WebDriver implicit wait)
- **Estado de BD**: el seed debe correr antes de cada ejecución completa
- **Registro**: usa timestamp en DNI/email para evitar colisiones en re-ejecuciones
