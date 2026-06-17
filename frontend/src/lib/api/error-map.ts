export const ERROR_MAP: Record<string, string> = {
  // auth-service
  USUARIO_DUPLICADO:
    'El DNI o correo ya está registrado. Por favor, usa otro.',
  CREDENCIALES_INVALIDAS:
    'DNI, correo o contraseña incorrectos.',
  USUARIO_NO_ENCONTRADO:
    'No encontramos una cuenta con esos datos.',
  TOKEN_INVALIDO:
    'El enlace de recuperación es inválido. Solicita uno nuevo.',
  TOKEN_EXPIRADO:
    'El enlace de recuperación ha expirado. Solicita uno nuevo.',
  TOKEN_FALTANTE:
    'Tu sesión ha expirado. Inicia sesión nuevamente.',
  NO_AUTENTICADO:
    'Debes iniciar sesión para continuar.',
  ROL_INSUFICIENTE:
    'No tienes permisos para realizar esta acción.',

  // appointment-service
  DATOS_DUPLICADOS:
    'El DNI, correo o nombre de usuario ya están en uso. Verifica e intenta de nuevo.',
  MEDICO_DUPLICADO:
    'El nombre de usuario ingresado ya está en uso. Por favor elige otro.',
  SLOT_NO_DISPONIBLE:
    'El horario seleccionado ya fue reservado. Por favor, elige otro.',
  CITA_DUPLICADA_MISMO_DIA:
    'Ya tienes una cita con este médico en el mismo día.',
  ESPECIALIDAD_DUPLICADA:
    'Ya existe una especialidad con ese nombre.',

  // clinical-service
  CONSULTA_ACTIVA_EXISTENTE:
    'Ya existe una consulta activa para este paciente.',
  CONSULTA_YA_FINALIZADA:
    'La consulta ya fue finalizada.',
  CONSULTA_NO_ENCONTRADA:
    'No se encontró la consulta solicitada.',
  PACIENTE_NO_AUTORIZADO:
    'No estás autorizado para ver esta información.',
  MEDICO_NO_AUTORIZADO:
    'No estás autorizado para realizar esta acción.',

  // file-service
  TIPO_MIME_NO_PERMITIDO:
    'Formato de archivo no permitido. Usa PDF o imagen.',
  TAMANO_ARCHIVO_EXCEDIDO:
    'El archivo es muy grande. Máximo permitido: 10 MB.',
  ARCHIVO_NO_ENCONTRADO:
    'No se encontró el archivo solicitado.',

  // ocr-service
  OCR_ERROR:
    'Ocurrió un error al procesar el documento. Intenta de nuevo.',
  VALIDATION_ERROR:
    'Datos incompletos para procesar el OCR.',
  NOT_FOUND:
    'No se encontraron resultados de OCR.',

  // gateway / shared
  ERROR_INTERNO:
    'Ocurrió un error inesperado. Intenta nuevamente.',
  RUTA_NO_ENCONTRADA:
    'El servicio solicitado no está disponible.',
  UPSTREAM_NO_DISPONIBLE:
    'El servicio está en mantenimiento. Intenta más tarde.',
};

export const DEFAULT_ERROR_MESSAGE =
  'Ocurrió un error inesperado. Intenta nuevamente.';

export const NETWORK_ERROR_MESSAGE =
  'No hay conexión con el servidor. Verifica tu red e intenta de nuevo.';
