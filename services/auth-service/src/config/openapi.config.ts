import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Clínica X — Auth Service API',
      version: '1.0.0',
      description: '## Autenticación\n\nTodos los endpoints protegidos requieren un **Bearer Token JWT**. Obtén el token en POST /api/auth/login.\n\n## Roles\n- **PACIENTE:** Acceso a citas e historial propio\n- **MEDICO:** Consultas asignadas y diagnósticos\n- **ADMIN:** Acceso total al sistema',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' ? 'https://clinica-x-auth-service.railway.app' : 'http://localhost:3000',
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
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nombre: { type: 'string', example: 'Ana' },
            apellido: { type: 'string', example: 'García' },
            email: { type: 'string', format: 'email', example: 'paciente@clinica.com' },
            dni: { type: 'string', example: '12345678' },
            rol: { type: 'string', enum: ['PACIENTE', 'MEDICO', 'ADMIN'] },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/modules/**/infrastructure/adapters/in/http/*.router.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
