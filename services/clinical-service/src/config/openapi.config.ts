import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Clínica X — Clinical Service API',
      version: '1.0.0',
      description: '## Gestión Clínica\n\nEndpoints para:\n- Inicio y finalización de consultas\n- Diagnósticos y recetas\n- Órdenes de análisis\n- Historial clínico del paciente\n- Catálogos (medicamentos, etc.)\n\n## Roles\n- **MEDICO:** Iniciar/finalizar consultas, emitir diagnósticos\n- **PACIENTE:** Ver historial, consultas\n- **LABORATORIO:** Cargar resultados de análisis',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' ? 'https://clinica-x-clinical-service.railway.app' : 'http://localhost:3002',
        description: process.env.NODE_ENV === 'production' ? 'Railway (Producción)' : 'Local (Desarrollo)',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token obtenido en POST /api/auth/login',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'No autorizado' },
            statusCode: { type: 'integer', example: 401 },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/modules/*/infrastructure/adapters/in/http/*.router.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
