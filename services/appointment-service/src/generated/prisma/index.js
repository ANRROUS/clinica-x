
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/library.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}




  const path = require('path')

/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.EspecialidadScalarFieldEnum = {
  id: 'id',
  nombre: 'nombre',
  activo: 'activo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MedicoScalarFieldEnum = {
  id: 'id',
  usuarioId: 'usuarioId',
  nombreUsuario: 'nombreUsuario',
  especialidadId: 'especialidadId',
  turno: 'turno',
  activo: 'activo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.HorarioMedicoScalarFieldEnum = {
  id: 'id',
  medicoId: 'medicoId',
  diaSemana: 'diaSemana',
  horaInicio: 'horaInicio',
  horaFin: 'horaFin',
  duracionSlot: 'duracionSlot',
  createdAt: 'createdAt'
};

exports.Prisma.CitaScalarFieldEnum = {
  id: 'id',
  pacienteId: 'pacienteId',
  medicoId: 'medicoId',
  fechaHora: 'fechaHora',
  estado: 'estado',
  tipoReserva: 'tipoReserva',
  motivo: 'motivo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Turno = exports.$Enums.Turno = {
  MANANA: 'MANANA',
  TARDE: 'TARDE'
};

exports.EstadoCita = exports.$Enums.EstadoCita = {
  CONFIRMADA: 'CONFIRMADA',
  EN_ATENCION: 'EN_ATENCION',
  COMPLETADA: 'COMPLETADA',
  CANCELADA: 'CANCELADA'
};

exports.TipoReserva = exports.$Enums.TipoReserva = {
  MANUAL: 'MANUAL',
  AUTOMATICA: 'AUTOMATICA'
};

exports.Prisma.ModelName = {
  Especialidad: 'Especialidad',
  Medico: 'Medico',
  HorarioMedico: 'HorarioMedico',
  Cita: 'Cita'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "D:\\Study_Ing. Software\\Estudio 2026\\Ciclo 01\\Curso Integrador II\\Clinica X\\services\\appointment-service\\src\\generated\\prisma",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "D:\\Study_Ing. Software\\Estudio 2026\\Ciclo 01\\Curso Integrador II\\Clinica X\\services\\appointment-service\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../../../prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "// =============================================================================\n// appointment-service — Prisma schema\n// =============================================================================\n// Schema Postgres: appointment_service\n// Tablas: especialidades, medicos, horarios_medico, citas\n// =============================================================================\n\ngenerator client {\n  provider = \"prisma-client-js\"\n  output   = \"../src/generated/prisma\"\n}\n\ndatasource db {\n  provider  = \"postgresql\"\n  url       = env(\"DATABASE_URL\")\n  directUrl = env(\"DIRECT_URL\")\n}\n\n// ─── Especialidad ───────────────────────────────────────────────────────────\nmodel Especialidad {\n  id        String   @id @default(uuid())\n  nombre    String   @unique\n  activo    Boolean  @default(true)\n  createdAt DateTime @default(now()) @map(\"creado_en\")\n  updatedAt DateTime @updatedAt @map(\"actualizado_en\")\n\n  medicos Medico[]\n\n  @@map(\"especialidades\")\n}\n\n// ─── Turno enum (mapeado a tabla para Prisma) ───────────────────────────────\nenum Turno {\n  MANANA @map(\"MANANA\")\n  TARDE  @map(\"TARDE\")\n}\n\n// ─── Medico ───────────────────────────────────────────────────────────────────\nmodel Medico {\n  id             String   @id @default(uuid())\n  usuarioId      String   @unique @map(\"usuario_id\")\n  nombreUsuario  String   @unique @map(\"nombre_usuario\")\n  especialidadId String   @map(\"especialidad_id\")\n  turno          Turno\n  activo         Boolean  @default(true)\n  createdAt      DateTime @default(now()) @map(\"creado_en\")\n  updatedAt      DateTime @updatedAt @map(\"actualizado_en\")\n\n  especialidad Especialidad    @relation(fields: [especialidadId], references: [id])\n  horarios     HorarioMedico[]\n  citas        Cita[]\n\n  @@map(\"medicos\")\n}\n\n// ─── HorarioMedico ────────────────────────────────────────────────────────────\nmodel HorarioMedico {\n  id           String   @id @default(uuid())\n  medicoId     String   @map(\"medico_id\")\n  diaSemana    Int      @map(\"dia_semana\") // 1=Lunes ... 7=Domingo\n  horaInicio   String   @map(\"hora_inicio\") // \"08:00\"\n  horaFin      String   @map(\"hora_fin\") // \"08:30\"\n  duracionSlot Int      @default(30) @map(\"duracion_slot\") // minutos\n  createdAt    DateTime @default(now()) @map(\"creado_en\")\n\n  medico Medico @relation(fields: [medicoId], references: [id], onDelete: Cascade)\n\n  @@unique([medicoId, diaSemana, horaInicio])\n  @@map(\"horarios_medico\")\n}\n\n// ─── Cita ─────────────────────────────────────────────────────────────────────\nenum EstadoCita {\n  CONFIRMADA  @map(\"CONFIRMADA\")\n  EN_ATENCION @map(\"EN_ATENCION\")\n  COMPLETADA  @map(\"COMPLETADA\")\n  CANCELADA   @map(\"CANCELADA\")\n}\n\nenum TipoReserva {\n  MANUAL     @map(\"MANUAL\")\n  AUTOMATICA @map(\"AUTOMATICA\")\n}\n\nmodel Cita {\n  id          String      @id @default(uuid())\n  pacienteId  String      @map(\"paciente_id\")\n  medicoId    String      @map(\"medico_id\")\n  fechaHora   DateTime    @map(\"fecha_hora\")\n  estado      EstadoCita  @default(CONFIRMADA)\n  tipoReserva TipoReserva @default(MANUAL) @map(\"tipo_reserva\")\n  motivo      String?\n  createdAt   DateTime    @default(now()) @map(\"creado_en\")\n  updatedAt   DateTime    @updatedAt @map(\"actualizado_en\")\n\n  medico Medico @relation(fields: [medicoId], references: [id])\n\n  @@index([medicoId, fechaHora])\n  @@index([pacienteId, fechaHora])\n  @@map(\"citas\")\n}\n",
  "inlineSchemaHash": "b9f51dacaf81ce39615692a29c4ed80662acc6dd636bc2f1c90ed6d7cf94420c",
  "copyEngine": true
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "src/generated/prisma",
    "generated/prisma",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"Especialidad\":{\"dbName\":\"especialidades\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nombre\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"activo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"creado_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"actualizado_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"medicos\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Medico\",\"relationName\":\"EspecialidadToMedico\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Medico\":{\"dbName\":\"medicos\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"usuarioId\",\"dbName\":\"usuario_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nombreUsuario\",\"dbName\":\"nombre_usuario\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"especialidadId\",\"dbName\":\"especialidad_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"turno\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Turno\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"activo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"creado_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"actualizado_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"especialidad\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Especialidad\",\"relationName\":\"EspecialidadToMedico\",\"relationFromFields\":[\"especialidadId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"horarios\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"HorarioMedico\",\"relationName\":\"HorarioMedicoToMedico\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"citas\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Cita\",\"relationName\":\"CitaToMedico\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"HorarioMedico\":{\"dbName\":\"horarios_medico\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"medicoId\",\"dbName\":\"medico_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"diaSemana\",\"dbName\":\"dia_semana\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"horaInicio\",\"dbName\":\"hora_inicio\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"horaFin\",\"dbName\":\"hora_fin\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"duracionSlot\",\"dbName\":\"duracion_slot\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":30,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"creado_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"medico\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Medico\",\"relationName\":\"HorarioMedicoToMedico\",\"relationFromFields\":[\"medicoId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"medicoId\",\"diaSemana\",\"horaInicio\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"medicoId\",\"diaSemana\",\"horaInicio\"]}],\"isGenerated\":false},\"Cita\":{\"dbName\":\"citas\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pacienteId\",\"dbName\":\"paciente_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"medicoId\",\"dbName\":\"medico_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fechaHora\",\"dbName\":\"fecha_hora\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estado\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"EstadoCita\",\"default\":\"CONFIRMADA\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tipoReserva\",\"dbName\":\"tipo_reserva\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"TipoReserva\",\"default\":\"MANUAL\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"motivo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"creado_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"actualizado_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"medico\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Medico\",\"relationName\":\"CitaToMedico\",\"relationFromFields\":[\"medicoId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"Turno\":{\"values\":[{\"name\":\"MANANA\",\"dbName\":\"MANANA\"},{\"name\":\"TARDE\",\"dbName\":\"TARDE\"}],\"dbName\":null},\"EstadoCita\":{\"values\":[{\"name\":\"CONFIRMADA\",\"dbName\":\"CONFIRMADA\"},{\"name\":\"EN_ATENCION\",\"dbName\":\"EN_ATENCION\"},{\"name\":\"COMPLETADA\",\"dbName\":\"COMPLETADA\"},{\"name\":\"CANCELADA\",\"dbName\":\"CANCELADA\"}],\"dbName\":null},\"TipoReserva\":{\"values\":[{\"name\":\"MANUAL\",\"dbName\":\"MANUAL\"},{\"name\":\"AUTOMATICA\",\"dbName\":\"AUTOMATICA\"}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined


const { warnEnvConflicts } = require('./runtime/library.js')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "query_engine-windows.dll.node");
path.join(process.cwd(), "src/generated/prisma/query_engine-windows.dll.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "src/generated/prisma/schema.prisma")
