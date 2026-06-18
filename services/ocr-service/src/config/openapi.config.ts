import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Clínica X — OCR Service API',
      version: '1.0.0',
      description: '## Procesamiento OCR\n\nEndpoints para:\n- Procesamiento de documentos (OCR)\n- Extracción de texto de imágenes\n- Gestión de resultados OCR\n- Consulta de estado de procesamiento\n\n## Autenticación\n- Usuarios: JWT Bearer token\n- Admin: JWT + rol ADMIN\n- Interno: API key especial para procesos internos\n\n## Nota\n- Este servicio es principalmente interno\n- El procesamiento es asincrónico',
    },
    servers: [
      {
        url: 'http://localhost:3004',
        description: 'Local (Desarrollo - Interno)',
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
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key interna para procesos de backend',
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
