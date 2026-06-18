import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Clínica X — Appointment Service API',
      version: '1.0.0',
      description: '## Gestión de Citas Médicas\n\nEndpoints para:\n- Administración de médicos y especialidades (ADMIN)\n- Reserva y consulta de citas (PACIENTE/MEDICO)\n- Disponibilidad de horarios\n- Calendario médico\n\n## Roles\n- **ADMIN:** Gestión de médicos, especialidades, métricas\n- **MEDICO:** Consultable disponibilidad, calendario\n- **PACIENTE:** Reservar citas, consultar disponibilidad',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' ? 'https://clinica-x-appointment-service.railway.app' : 'http://localhost:3001',
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
