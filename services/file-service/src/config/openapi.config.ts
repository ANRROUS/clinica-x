import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Clínica X — File Service API',
      version: '1.0.0',
      description: '## Gestión de Archivos\n\nEndpoints para:\n- Upload de archivos (PDFs, imágenes)\n- Almacenamiento en S3/Supabase\n- Generación de URLs firmadas para descarga\n- Eliminación de archivos\n\n## Seguridad\n- Validación de MIME type\n- Límite de tamaño configurable\n- URLs firmadas con expiración\n- Almacenamiento en S3 (Supabase Storage)',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' ? 'https://clinica-x-file-service.railway.app' : 'http://localhost:3003',
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
