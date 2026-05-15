
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Especialidad
 * 
 */
export type Especialidad = $Result.DefaultSelection<Prisma.$EspecialidadPayload>
/**
 * Model Medico
 * 
 */
export type Medico = $Result.DefaultSelection<Prisma.$MedicoPayload>
/**
 * Model HorarioMedico
 * 
 */
export type HorarioMedico = $Result.DefaultSelection<Prisma.$HorarioMedicoPayload>
/**
 * Model Cita
 * 
 */
export type Cita = $Result.DefaultSelection<Prisma.$CitaPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Turno: {
  MANANA: 'MANANA',
  TARDE: 'TARDE'
};

export type Turno = (typeof Turno)[keyof typeof Turno]


export const EstadoCita: {
  CONFIRMADA: 'CONFIRMADA',
  EN_ATENCION: 'EN_ATENCION',
  COMPLETADA: 'COMPLETADA',
  CANCELADA: 'CANCELADA'
};

export type EstadoCita = (typeof EstadoCita)[keyof typeof EstadoCita]


export const TipoReserva: {
  MANUAL: 'MANUAL',
  AUTOMATICA: 'AUTOMATICA'
};

export type TipoReserva = (typeof TipoReserva)[keyof typeof TipoReserva]

}

export type Turno = $Enums.Turno

export const Turno: typeof $Enums.Turno

export type EstadoCita = $Enums.EstadoCita

export const EstadoCita: typeof $Enums.EstadoCita

export type TipoReserva = $Enums.TipoReserva

export const TipoReserva: typeof $Enums.TipoReserva

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Especialidads
 * const especialidads = await prisma.especialidad.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Especialidads
   * const especialidads = await prisma.especialidad.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.especialidad`: Exposes CRUD operations for the **Especialidad** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Especialidads
    * const especialidads = await prisma.especialidad.findMany()
    * ```
    */
  get especialidad(): Prisma.EspecialidadDelegate<ExtArgs>;

  /**
   * `prisma.medico`: Exposes CRUD operations for the **Medico** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Medicos
    * const medicos = await prisma.medico.findMany()
    * ```
    */
  get medico(): Prisma.MedicoDelegate<ExtArgs>;

  /**
   * `prisma.horarioMedico`: Exposes CRUD operations for the **HorarioMedico** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HorarioMedicos
    * const horarioMedicos = await prisma.horarioMedico.findMany()
    * ```
    */
  get horarioMedico(): Prisma.HorarioMedicoDelegate<ExtArgs>;

  /**
   * `prisma.cita`: Exposes CRUD operations for the **Cita** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Citas
    * const citas = await prisma.cita.findMany()
    * ```
    */
  get cita(): Prisma.CitaDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Especialidad: 'Especialidad',
    Medico: 'Medico',
    HorarioMedico: 'HorarioMedico',
    Cita: 'Cita'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "especialidad" | "medico" | "horarioMedico" | "cita"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Especialidad: {
        payload: Prisma.$EspecialidadPayload<ExtArgs>
        fields: Prisma.EspecialidadFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EspecialidadFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspecialidadPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EspecialidadFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspecialidadPayload>
          }
          findFirst: {
            args: Prisma.EspecialidadFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspecialidadPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EspecialidadFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspecialidadPayload>
          }
          findMany: {
            args: Prisma.EspecialidadFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspecialidadPayload>[]
          }
          create: {
            args: Prisma.EspecialidadCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspecialidadPayload>
          }
          createMany: {
            args: Prisma.EspecialidadCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EspecialidadCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspecialidadPayload>[]
          }
          delete: {
            args: Prisma.EspecialidadDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspecialidadPayload>
          }
          update: {
            args: Prisma.EspecialidadUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspecialidadPayload>
          }
          deleteMany: {
            args: Prisma.EspecialidadDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EspecialidadUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EspecialidadUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspecialidadPayload>
          }
          aggregate: {
            args: Prisma.EspecialidadAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEspecialidad>
          }
          groupBy: {
            args: Prisma.EspecialidadGroupByArgs<ExtArgs>
            result: $Utils.Optional<EspecialidadGroupByOutputType>[]
          }
          count: {
            args: Prisma.EspecialidadCountArgs<ExtArgs>
            result: $Utils.Optional<EspecialidadCountAggregateOutputType> | number
          }
        }
      }
      Medico: {
        payload: Prisma.$MedicoPayload<ExtArgs>
        fields: Prisma.MedicoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MedicoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MedicoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicoPayload>
          }
          findFirst: {
            args: Prisma.MedicoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MedicoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicoPayload>
          }
          findMany: {
            args: Prisma.MedicoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicoPayload>[]
          }
          create: {
            args: Prisma.MedicoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicoPayload>
          }
          createMany: {
            args: Prisma.MedicoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MedicoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicoPayload>[]
          }
          delete: {
            args: Prisma.MedicoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicoPayload>
          }
          update: {
            args: Prisma.MedicoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicoPayload>
          }
          deleteMany: {
            args: Prisma.MedicoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MedicoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MedicoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicoPayload>
          }
          aggregate: {
            args: Prisma.MedicoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMedico>
          }
          groupBy: {
            args: Prisma.MedicoGroupByArgs<ExtArgs>
            result: $Utils.Optional<MedicoGroupByOutputType>[]
          }
          count: {
            args: Prisma.MedicoCountArgs<ExtArgs>
            result: $Utils.Optional<MedicoCountAggregateOutputType> | number
          }
        }
      }
      HorarioMedico: {
        payload: Prisma.$HorarioMedicoPayload<ExtArgs>
        fields: Prisma.HorarioMedicoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HorarioMedicoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HorarioMedicoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HorarioMedicoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HorarioMedicoPayload>
          }
          findFirst: {
            args: Prisma.HorarioMedicoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HorarioMedicoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HorarioMedicoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HorarioMedicoPayload>
          }
          findMany: {
            args: Prisma.HorarioMedicoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HorarioMedicoPayload>[]
          }
          create: {
            args: Prisma.HorarioMedicoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HorarioMedicoPayload>
          }
          createMany: {
            args: Prisma.HorarioMedicoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HorarioMedicoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HorarioMedicoPayload>[]
          }
          delete: {
            args: Prisma.HorarioMedicoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HorarioMedicoPayload>
          }
          update: {
            args: Prisma.HorarioMedicoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HorarioMedicoPayload>
          }
          deleteMany: {
            args: Prisma.HorarioMedicoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HorarioMedicoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.HorarioMedicoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HorarioMedicoPayload>
          }
          aggregate: {
            args: Prisma.HorarioMedicoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHorarioMedico>
          }
          groupBy: {
            args: Prisma.HorarioMedicoGroupByArgs<ExtArgs>
            result: $Utils.Optional<HorarioMedicoGroupByOutputType>[]
          }
          count: {
            args: Prisma.HorarioMedicoCountArgs<ExtArgs>
            result: $Utils.Optional<HorarioMedicoCountAggregateOutputType> | number
          }
        }
      }
      Cita: {
        payload: Prisma.$CitaPayload<ExtArgs>
        fields: Prisma.CitaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CitaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CitaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitaPayload>
          }
          findFirst: {
            args: Prisma.CitaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CitaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitaPayload>
          }
          findMany: {
            args: Prisma.CitaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitaPayload>[]
          }
          create: {
            args: Prisma.CitaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitaPayload>
          }
          createMany: {
            args: Prisma.CitaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CitaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitaPayload>[]
          }
          delete: {
            args: Prisma.CitaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitaPayload>
          }
          update: {
            args: Prisma.CitaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitaPayload>
          }
          deleteMany: {
            args: Prisma.CitaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CitaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CitaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CitaPayload>
          }
          aggregate: {
            args: Prisma.CitaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCita>
          }
          groupBy: {
            args: Prisma.CitaGroupByArgs<ExtArgs>
            result: $Utils.Optional<CitaGroupByOutputType>[]
          }
          count: {
            args: Prisma.CitaCountArgs<ExtArgs>
            result: $Utils.Optional<CitaCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type EspecialidadCountOutputType
   */

  export type EspecialidadCountOutputType = {
    medicos: number
  }

  export type EspecialidadCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    medicos?: boolean | EspecialidadCountOutputTypeCountMedicosArgs
  }

  // Custom InputTypes
  /**
   * EspecialidadCountOutputType without action
   */
  export type EspecialidadCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EspecialidadCountOutputType
     */
    select?: EspecialidadCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EspecialidadCountOutputType without action
   */
  export type EspecialidadCountOutputTypeCountMedicosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MedicoWhereInput
  }


  /**
   * Count Type MedicoCountOutputType
   */

  export type MedicoCountOutputType = {
    horarios: number
    citas: number
  }

  export type MedicoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    horarios?: boolean | MedicoCountOutputTypeCountHorariosArgs
    citas?: boolean | MedicoCountOutputTypeCountCitasArgs
  }

  // Custom InputTypes
  /**
   * MedicoCountOutputType without action
   */
  export type MedicoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicoCountOutputType
     */
    select?: MedicoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MedicoCountOutputType without action
   */
  export type MedicoCountOutputTypeCountHorariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HorarioMedicoWhereInput
  }

  /**
   * MedicoCountOutputType without action
   */
  export type MedicoCountOutputTypeCountCitasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CitaWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Especialidad
   */

  export type AggregateEspecialidad = {
    _count: EspecialidadCountAggregateOutputType | null
    _min: EspecialidadMinAggregateOutputType | null
    _max: EspecialidadMaxAggregateOutputType | null
  }

  export type EspecialidadMinAggregateOutputType = {
    id: string | null
    nombre: string | null
    createdAt: Date | null
  }

  export type EspecialidadMaxAggregateOutputType = {
    id: string | null
    nombre: string | null
    createdAt: Date | null
  }

  export type EspecialidadCountAggregateOutputType = {
    id: number
    nombre: number
    createdAt: number
    _all: number
  }


  export type EspecialidadMinAggregateInputType = {
    id?: true
    nombre?: true
    createdAt?: true
  }

  export type EspecialidadMaxAggregateInputType = {
    id?: true
    nombre?: true
    createdAt?: true
  }

  export type EspecialidadCountAggregateInputType = {
    id?: true
    nombre?: true
    createdAt?: true
    _all?: true
  }

  export type EspecialidadAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Especialidad to aggregate.
     */
    where?: EspecialidadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Especialidads to fetch.
     */
    orderBy?: EspecialidadOrderByWithRelationInput | EspecialidadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EspecialidadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Especialidads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Especialidads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Especialidads
    **/
    _count?: true | EspecialidadCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EspecialidadMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EspecialidadMaxAggregateInputType
  }

  export type GetEspecialidadAggregateType<T extends EspecialidadAggregateArgs> = {
        [P in keyof T & keyof AggregateEspecialidad]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEspecialidad[P]>
      : GetScalarType<T[P], AggregateEspecialidad[P]>
  }




  export type EspecialidadGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EspecialidadWhereInput
    orderBy?: EspecialidadOrderByWithAggregationInput | EspecialidadOrderByWithAggregationInput[]
    by: EspecialidadScalarFieldEnum[] | EspecialidadScalarFieldEnum
    having?: EspecialidadScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EspecialidadCountAggregateInputType | true
    _min?: EspecialidadMinAggregateInputType
    _max?: EspecialidadMaxAggregateInputType
  }

  export type EspecialidadGroupByOutputType = {
    id: string
    nombre: string
    createdAt: Date
    _count: EspecialidadCountAggregateOutputType | null
    _min: EspecialidadMinAggregateOutputType | null
    _max: EspecialidadMaxAggregateOutputType | null
  }

  type GetEspecialidadGroupByPayload<T extends EspecialidadGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EspecialidadGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EspecialidadGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EspecialidadGroupByOutputType[P]>
            : GetScalarType<T[P], EspecialidadGroupByOutputType[P]>
        }
      >
    >


  export type EspecialidadSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    createdAt?: boolean
    medicos?: boolean | Especialidad$medicosArgs<ExtArgs>
    _count?: boolean | EspecialidadCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["especialidad"]>

  export type EspecialidadSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["especialidad"]>

  export type EspecialidadSelectScalar = {
    id?: boolean
    nombre?: boolean
    createdAt?: boolean
  }

  export type EspecialidadInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    medicos?: boolean | Especialidad$medicosArgs<ExtArgs>
    _count?: boolean | EspecialidadCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EspecialidadIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $EspecialidadPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Especialidad"
    objects: {
      medicos: Prisma.$MedicoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nombre: string
      createdAt: Date
    }, ExtArgs["result"]["especialidad"]>
    composites: {}
  }

  type EspecialidadGetPayload<S extends boolean | null | undefined | EspecialidadDefaultArgs> = $Result.GetResult<Prisma.$EspecialidadPayload, S>

  type EspecialidadCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EspecialidadFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EspecialidadCountAggregateInputType | true
    }

  export interface EspecialidadDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Especialidad'], meta: { name: 'Especialidad' } }
    /**
     * Find zero or one Especialidad that matches the filter.
     * @param {EspecialidadFindUniqueArgs} args - Arguments to find a Especialidad
     * @example
     * // Get one Especialidad
     * const especialidad = await prisma.especialidad.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EspecialidadFindUniqueArgs>(args: SelectSubset<T, EspecialidadFindUniqueArgs<ExtArgs>>): Prisma__EspecialidadClient<$Result.GetResult<Prisma.$EspecialidadPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Especialidad that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EspecialidadFindUniqueOrThrowArgs} args - Arguments to find a Especialidad
     * @example
     * // Get one Especialidad
     * const especialidad = await prisma.especialidad.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EspecialidadFindUniqueOrThrowArgs>(args: SelectSubset<T, EspecialidadFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EspecialidadClient<$Result.GetResult<Prisma.$EspecialidadPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Especialidad that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EspecialidadFindFirstArgs} args - Arguments to find a Especialidad
     * @example
     * // Get one Especialidad
     * const especialidad = await prisma.especialidad.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EspecialidadFindFirstArgs>(args?: SelectSubset<T, EspecialidadFindFirstArgs<ExtArgs>>): Prisma__EspecialidadClient<$Result.GetResult<Prisma.$EspecialidadPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Especialidad that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EspecialidadFindFirstOrThrowArgs} args - Arguments to find a Especialidad
     * @example
     * // Get one Especialidad
     * const especialidad = await prisma.especialidad.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EspecialidadFindFirstOrThrowArgs>(args?: SelectSubset<T, EspecialidadFindFirstOrThrowArgs<ExtArgs>>): Prisma__EspecialidadClient<$Result.GetResult<Prisma.$EspecialidadPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Especialidads that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EspecialidadFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Especialidads
     * const especialidads = await prisma.especialidad.findMany()
     * 
     * // Get first 10 Especialidads
     * const especialidads = await prisma.especialidad.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const especialidadWithIdOnly = await prisma.especialidad.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EspecialidadFindManyArgs>(args?: SelectSubset<T, EspecialidadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EspecialidadPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Especialidad.
     * @param {EspecialidadCreateArgs} args - Arguments to create a Especialidad.
     * @example
     * // Create one Especialidad
     * const Especialidad = await prisma.especialidad.create({
     *   data: {
     *     // ... data to create a Especialidad
     *   }
     * })
     * 
     */
    create<T extends EspecialidadCreateArgs>(args: SelectSubset<T, EspecialidadCreateArgs<ExtArgs>>): Prisma__EspecialidadClient<$Result.GetResult<Prisma.$EspecialidadPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Especialidads.
     * @param {EspecialidadCreateManyArgs} args - Arguments to create many Especialidads.
     * @example
     * // Create many Especialidads
     * const especialidad = await prisma.especialidad.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EspecialidadCreateManyArgs>(args?: SelectSubset<T, EspecialidadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Especialidads and returns the data saved in the database.
     * @param {EspecialidadCreateManyAndReturnArgs} args - Arguments to create many Especialidads.
     * @example
     * // Create many Especialidads
     * const especialidad = await prisma.especialidad.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Especialidads and only return the `id`
     * const especialidadWithIdOnly = await prisma.especialidad.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EspecialidadCreateManyAndReturnArgs>(args?: SelectSubset<T, EspecialidadCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EspecialidadPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Especialidad.
     * @param {EspecialidadDeleteArgs} args - Arguments to delete one Especialidad.
     * @example
     * // Delete one Especialidad
     * const Especialidad = await prisma.especialidad.delete({
     *   where: {
     *     // ... filter to delete one Especialidad
     *   }
     * })
     * 
     */
    delete<T extends EspecialidadDeleteArgs>(args: SelectSubset<T, EspecialidadDeleteArgs<ExtArgs>>): Prisma__EspecialidadClient<$Result.GetResult<Prisma.$EspecialidadPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Especialidad.
     * @param {EspecialidadUpdateArgs} args - Arguments to update one Especialidad.
     * @example
     * // Update one Especialidad
     * const especialidad = await prisma.especialidad.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EspecialidadUpdateArgs>(args: SelectSubset<T, EspecialidadUpdateArgs<ExtArgs>>): Prisma__EspecialidadClient<$Result.GetResult<Prisma.$EspecialidadPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Especialidads.
     * @param {EspecialidadDeleteManyArgs} args - Arguments to filter Especialidads to delete.
     * @example
     * // Delete a few Especialidads
     * const { count } = await prisma.especialidad.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EspecialidadDeleteManyArgs>(args?: SelectSubset<T, EspecialidadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Especialidads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EspecialidadUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Especialidads
     * const especialidad = await prisma.especialidad.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EspecialidadUpdateManyArgs>(args: SelectSubset<T, EspecialidadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Especialidad.
     * @param {EspecialidadUpsertArgs} args - Arguments to update or create a Especialidad.
     * @example
     * // Update or create a Especialidad
     * const especialidad = await prisma.especialidad.upsert({
     *   create: {
     *     // ... data to create a Especialidad
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Especialidad we want to update
     *   }
     * })
     */
    upsert<T extends EspecialidadUpsertArgs>(args: SelectSubset<T, EspecialidadUpsertArgs<ExtArgs>>): Prisma__EspecialidadClient<$Result.GetResult<Prisma.$EspecialidadPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Especialidads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EspecialidadCountArgs} args - Arguments to filter Especialidads to count.
     * @example
     * // Count the number of Especialidads
     * const count = await prisma.especialidad.count({
     *   where: {
     *     // ... the filter for the Especialidads we want to count
     *   }
     * })
    **/
    count<T extends EspecialidadCountArgs>(
      args?: Subset<T, EspecialidadCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EspecialidadCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Especialidad.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EspecialidadAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EspecialidadAggregateArgs>(args: Subset<T, EspecialidadAggregateArgs>): Prisma.PrismaPromise<GetEspecialidadAggregateType<T>>

    /**
     * Group by Especialidad.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EspecialidadGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EspecialidadGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EspecialidadGroupByArgs['orderBy'] }
        : { orderBy?: EspecialidadGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EspecialidadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEspecialidadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Especialidad model
   */
  readonly fields: EspecialidadFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Especialidad.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EspecialidadClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    medicos<T extends Especialidad$medicosArgs<ExtArgs> = {}>(args?: Subset<T, Especialidad$medicosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MedicoPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Especialidad model
   */ 
  interface EspecialidadFieldRefs {
    readonly id: FieldRef<"Especialidad", 'String'>
    readonly nombre: FieldRef<"Especialidad", 'String'>
    readonly createdAt: FieldRef<"Especialidad", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Especialidad findUnique
   */
  export type EspecialidadFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Especialidad
     */
    select?: EspecialidadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspecialidadInclude<ExtArgs> | null
    /**
     * Filter, which Especialidad to fetch.
     */
    where: EspecialidadWhereUniqueInput
  }

  /**
   * Especialidad findUniqueOrThrow
   */
  export type EspecialidadFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Especialidad
     */
    select?: EspecialidadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspecialidadInclude<ExtArgs> | null
    /**
     * Filter, which Especialidad to fetch.
     */
    where: EspecialidadWhereUniqueInput
  }

  /**
   * Especialidad findFirst
   */
  export type EspecialidadFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Especialidad
     */
    select?: EspecialidadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspecialidadInclude<ExtArgs> | null
    /**
     * Filter, which Especialidad to fetch.
     */
    where?: EspecialidadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Especialidads to fetch.
     */
    orderBy?: EspecialidadOrderByWithRelationInput | EspecialidadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Especialidads.
     */
    cursor?: EspecialidadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Especialidads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Especialidads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Especialidads.
     */
    distinct?: EspecialidadScalarFieldEnum | EspecialidadScalarFieldEnum[]
  }

  /**
   * Especialidad findFirstOrThrow
   */
  export type EspecialidadFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Especialidad
     */
    select?: EspecialidadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspecialidadInclude<ExtArgs> | null
    /**
     * Filter, which Especialidad to fetch.
     */
    where?: EspecialidadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Especialidads to fetch.
     */
    orderBy?: EspecialidadOrderByWithRelationInput | EspecialidadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Especialidads.
     */
    cursor?: EspecialidadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Especialidads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Especialidads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Especialidads.
     */
    distinct?: EspecialidadScalarFieldEnum | EspecialidadScalarFieldEnum[]
  }

  /**
   * Especialidad findMany
   */
  export type EspecialidadFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Especialidad
     */
    select?: EspecialidadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspecialidadInclude<ExtArgs> | null
    /**
     * Filter, which Especialidads to fetch.
     */
    where?: EspecialidadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Especialidads to fetch.
     */
    orderBy?: EspecialidadOrderByWithRelationInput | EspecialidadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Especialidads.
     */
    cursor?: EspecialidadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Especialidads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Especialidads.
     */
    skip?: number
    distinct?: EspecialidadScalarFieldEnum | EspecialidadScalarFieldEnum[]
  }

  /**
   * Especialidad create
   */
  export type EspecialidadCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Especialidad
     */
    select?: EspecialidadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspecialidadInclude<ExtArgs> | null
    /**
     * The data needed to create a Especialidad.
     */
    data: XOR<EspecialidadCreateInput, EspecialidadUncheckedCreateInput>
  }

  /**
   * Especialidad createMany
   */
  export type EspecialidadCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Especialidads.
     */
    data: EspecialidadCreateManyInput | EspecialidadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Especialidad createManyAndReturn
   */
  export type EspecialidadCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Especialidad
     */
    select?: EspecialidadSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Especialidads.
     */
    data: EspecialidadCreateManyInput | EspecialidadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Especialidad update
   */
  export type EspecialidadUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Especialidad
     */
    select?: EspecialidadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspecialidadInclude<ExtArgs> | null
    /**
     * The data needed to update a Especialidad.
     */
    data: XOR<EspecialidadUpdateInput, EspecialidadUncheckedUpdateInput>
    /**
     * Choose, which Especialidad to update.
     */
    where: EspecialidadWhereUniqueInput
  }

  /**
   * Especialidad updateMany
   */
  export type EspecialidadUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Especialidads.
     */
    data: XOR<EspecialidadUpdateManyMutationInput, EspecialidadUncheckedUpdateManyInput>
    /**
     * Filter which Especialidads to update
     */
    where?: EspecialidadWhereInput
  }

  /**
   * Especialidad upsert
   */
  export type EspecialidadUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Especialidad
     */
    select?: EspecialidadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspecialidadInclude<ExtArgs> | null
    /**
     * The filter to search for the Especialidad to update in case it exists.
     */
    where: EspecialidadWhereUniqueInput
    /**
     * In case the Especialidad found by the `where` argument doesn't exist, create a new Especialidad with this data.
     */
    create: XOR<EspecialidadCreateInput, EspecialidadUncheckedCreateInput>
    /**
     * In case the Especialidad was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EspecialidadUpdateInput, EspecialidadUncheckedUpdateInput>
  }

  /**
   * Especialidad delete
   */
  export type EspecialidadDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Especialidad
     */
    select?: EspecialidadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspecialidadInclude<ExtArgs> | null
    /**
     * Filter which Especialidad to delete.
     */
    where: EspecialidadWhereUniqueInput
  }

  /**
   * Especialidad deleteMany
   */
  export type EspecialidadDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Especialidads to delete
     */
    where?: EspecialidadWhereInput
  }

  /**
   * Especialidad.medicos
   */
  export type Especialidad$medicosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medico
     */
    select?: MedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicoInclude<ExtArgs> | null
    where?: MedicoWhereInput
    orderBy?: MedicoOrderByWithRelationInput | MedicoOrderByWithRelationInput[]
    cursor?: MedicoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MedicoScalarFieldEnum | MedicoScalarFieldEnum[]
  }

  /**
   * Especialidad without action
   */
  export type EspecialidadDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Especialidad
     */
    select?: EspecialidadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspecialidadInclude<ExtArgs> | null
  }


  /**
   * Model Medico
   */

  export type AggregateMedico = {
    _count: MedicoCountAggregateOutputType | null
    _min: MedicoMinAggregateOutputType | null
    _max: MedicoMaxAggregateOutputType | null
  }

  export type MedicoMinAggregateOutputType = {
    id: string | null
    usuarioId: string | null
    nombreUsuario: string | null
    especialidadId: string | null
    turno: $Enums.Turno | null
    activo: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MedicoMaxAggregateOutputType = {
    id: string | null
    usuarioId: string | null
    nombreUsuario: string | null
    especialidadId: string | null
    turno: $Enums.Turno | null
    activo: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MedicoCountAggregateOutputType = {
    id: number
    usuarioId: number
    nombreUsuario: number
    especialidadId: number
    turno: number
    activo: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MedicoMinAggregateInputType = {
    id?: true
    usuarioId?: true
    nombreUsuario?: true
    especialidadId?: true
    turno?: true
    activo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MedicoMaxAggregateInputType = {
    id?: true
    usuarioId?: true
    nombreUsuario?: true
    especialidadId?: true
    turno?: true
    activo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MedicoCountAggregateInputType = {
    id?: true
    usuarioId?: true
    nombreUsuario?: true
    especialidadId?: true
    turno?: true
    activo?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MedicoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Medico to aggregate.
     */
    where?: MedicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Medicos to fetch.
     */
    orderBy?: MedicoOrderByWithRelationInput | MedicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MedicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Medicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Medicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Medicos
    **/
    _count?: true | MedicoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MedicoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MedicoMaxAggregateInputType
  }

  export type GetMedicoAggregateType<T extends MedicoAggregateArgs> = {
        [P in keyof T & keyof AggregateMedico]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMedico[P]>
      : GetScalarType<T[P], AggregateMedico[P]>
  }




  export type MedicoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MedicoWhereInput
    orderBy?: MedicoOrderByWithAggregationInput | MedicoOrderByWithAggregationInput[]
    by: MedicoScalarFieldEnum[] | MedicoScalarFieldEnum
    having?: MedicoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MedicoCountAggregateInputType | true
    _min?: MedicoMinAggregateInputType
    _max?: MedicoMaxAggregateInputType
  }

  export type MedicoGroupByOutputType = {
    id: string
    usuarioId: string
    nombreUsuario: string
    especialidadId: string
    turno: $Enums.Turno
    activo: boolean
    createdAt: Date
    updatedAt: Date
    _count: MedicoCountAggregateOutputType | null
    _min: MedicoMinAggregateOutputType | null
    _max: MedicoMaxAggregateOutputType | null
  }

  type GetMedicoGroupByPayload<T extends MedicoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MedicoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MedicoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MedicoGroupByOutputType[P]>
            : GetScalarType<T[P], MedicoGroupByOutputType[P]>
        }
      >
    >


  export type MedicoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    usuarioId?: boolean
    nombreUsuario?: boolean
    especialidadId?: boolean
    turno?: boolean
    activo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    especialidad?: boolean | EspecialidadDefaultArgs<ExtArgs>
    horarios?: boolean | Medico$horariosArgs<ExtArgs>
    citas?: boolean | Medico$citasArgs<ExtArgs>
    _count?: boolean | MedicoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["medico"]>

  export type MedicoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    usuarioId?: boolean
    nombreUsuario?: boolean
    especialidadId?: boolean
    turno?: boolean
    activo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    especialidad?: boolean | EspecialidadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["medico"]>

  export type MedicoSelectScalar = {
    id?: boolean
    usuarioId?: boolean
    nombreUsuario?: boolean
    especialidadId?: boolean
    turno?: boolean
    activo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MedicoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    especialidad?: boolean | EspecialidadDefaultArgs<ExtArgs>
    horarios?: boolean | Medico$horariosArgs<ExtArgs>
    citas?: boolean | Medico$citasArgs<ExtArgs>
    _count?: boolean | MedicoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MedicoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    especialidad?: boolean | EspecialidadDefaultArgs<ExtArgs>
  }

  export type $MedicoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Medico"
    objects: {
      especialidad: Prisma.$EspecialidadPayload<ExtArgs>
      horarios: Prisma.$HorarioMedicoPayload<ExtArgs>[]
      citas: Prisma.$CitaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      usuarioId: string
      nombreUsuario: string
      especialidadId: string
      turno: $Enums.Turno
      activo: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["medico"]>
    composites: {}
  }

  type MedicoGetPayload<S extends boolean | null | undefined | MedicoDefaultArgs> = $Result.GetResult<Prisma.$MedicoPayload, S>

  type MedicoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MedicoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MedicoCountAggregateInputType | true
    }

  export interface MedicoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Medico'], meta: { name: 'Medico' } }
    /**
     * Find zero or one Medico that matches the filter.
     * @param {MedicoFindUniqueArgs} args - Arguments to find a Medico
     * @example
     * // Get one Medico
     * const medico = await prisma.medico.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MedicoFindUniqueArgs>(args: SelectSubset<T, MedicoFindUniqueArgs<ExtArgs>>): Prisma__MedicoClient<$Result.GetResult<Prisma.$MedicoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Medico that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MedicoFindUniqueOrThrowArgs} args - Arguments to find a Medico
     * @example
     * // Get one Medico
     * const medico = await prisma.medico.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MedicoFindUniqueOrThrowArgs>(args: SelectSubset<T, MedicoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MedicoClient<$Result.GetResult<Prisma.$MedicoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Medico that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicoFindFirstArgs} args - Arguments to find a Medico
     * @example
     * // Get one Medico
     * const medico = await prisma.medico.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MedicoFindFirstArgs>(args?: SelectSubset<T, MedicoFindFirstArgs<ExtArgs>>): Prisma__MedicoClient<$Result.GetResult<Prisma.$MedicoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Medico that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicoFindFirstOrThrowArgs} args - Arguments to find a Medico
     * @example
     * // Get one Medico
     * const medico = await prisma.medico.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MedicoFindFirstOrThrowArgs>(args?: SelectSubset<T, MedicoFindFirstOrThrowArgs<ExtArgs>>): Prisma__MedicoClient<$Result.GetResult<Prisma.$MedicoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Medicos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Medicos
     * const medicos = await prisma.medico.findMany()
     * 
     * // Get first 10 Medicos
     * const medicos = await prisma.medico.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const medicoWithIdOnly = await prisma.medico.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MedicoFindManyArgs>(args?: SelectSubset<T, MedicoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MedicoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Medico.
     * @param {MedicoCreateArgs} args - Arguments to create a Medico.
     * @example
     * // Create one Medico
     * const Medico = await prisma.medico.create({
     *   data: {
     *     // ... data to create a Medico
     *   }
     * })
     * 
     */
    create<T extends MedicoCreateArgs>(args: SelectSubset<T, MedicoCreateArgs<ExtArgs>>): Prisma__MedicoClient<$Result.GetResult<Prisma.$MedicoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Medicos.
     * @param {MedicoCreateManyArgs} args - Arguments to create many Medicos.
     * @example
     * // Create many Medicos
     * const medico = await prisma.medico.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MedicoCreateManyArgs>(args?: SelectSubset<T, MedicoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Medicos and returns the data saved in the database.
     * @param {MedicoCreateManyAndReturnArgs} args - Arguments to create many Medicos.
     * @example
     * // Create many Medicos
     * const medico = await prisma.medico.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Medicos and only return the `id`
     * const medicoWithIdOnly = await prisma.medico.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MedicoCreateManyAndReturnArgs>(args?: SelectSubset<T, MedicoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MedicoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Medico.
     * @param {MedicoDeleteArgs} args - Arguments to delete one Medico.
     * @example
     * // Delete one Medico
     * const Medico = await prisma.medico.delete({
     *   where: {
     *     // ... filter to delete one Medico
     *   }
     * })
     * 
     */
    delete<T extends MedicoDeleteArgs>(args: SelectSubset<T, MedicoDeleteArgs<ExtArgs>>): Prisma__MedicoClient<$Result.GetResult<Prisma.$MedicoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Medico.
     * @param {MedicoUpdateArgs} args - Arguments to update one Medico.
     * @example
     * // Update one Medico
     * const medico = await prisma.medico.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MedicoUpdateArgs>(args: SelectSubset<T, MedicoUpdateArgs<ExtArgs>>): Prisma__MedicoClient<$Result.GetResult<Prisma.$MedicoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Medicos.
     * @param {MedicoDeleteManyArgs} args - Arguments to filter Medicos to delete.
     * @example
     * // Delete a few Medicos
     * const { count } = await prisma.medico.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MedicoDeleteManyArgs>(args?: SelectSubset<T, MedicoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Medicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Medicos
     * const medico = await prisma.medico.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MedicoUpdateManyArgs>(args: SelectSubset<T, MedicoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Medico.
     * @param {MedicoUpsertArgs} args - Arguments to update or create a Medico.
     * @example
     * // Update or create a Medico
     * const medico = await prisma.medico.upsert({
     *   create: {
     *     // ... data to create a Medico
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Medico we want to update
     *   }
     * })
     */
    upsert<T extends MedicoUpsertArgs>(args: SelectSubset<T, MedicoUpsertArgs<ExtArgs>>): Prisma__MedicoClient<$Result.GetResult<Prisma.$MedicoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Medicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicoCountArgs} args - Arguments to filter Medicos to count.
     * @example
     * // Count the number of Medicos
     * const count = await prisma.medico.count({
     *   where: {
     *     // ... the filter for the Medicos we want to count
     *   }
     * })
    **/
    count<T extends MedicoCountArgs>(
      args?: Subset<T, MedicoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MedicoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Medico.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MedicoAggregateArgs>(args: Subset<T, MedicoAggregateArgs>): Prisma.PrismaPromise<GetMedicoAggregateType<T>>

    /**
     * Group by Medico.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MedicoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MedicoGroupByArgs['orderBy'] }
        : { orderBy?: MedicoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MedicoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMedicoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Medico model
   */
  readonly fields: MedicoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Medico.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MedicoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    especialidad<T extends EspecialidadDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EspecialidadDefaultArgs<ExtArgs>>): Prisma__EspecialidadClient<$Result.GetResult<Prisma.$EspecialidadPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    horarios<T extends Medico$horariosArgs<ExtArgs> = {}>(args?: Subset<T, Medico$horariosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HorarioMedicoPayload<ExtArgs>, T, "findMany"> | Null>
    citas<T extends Medico$citasArgs<ExtArgs> = {}>(args?: Subset<T, Medico$citasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CitaPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Medico model
   */ 
  interface MedicoFieldRefs {
    readonly id: FieldRef<"Medico", 'String'>
    readonly usuarioId: FieldRef<"Medico", 'String'>
    readonly nombreUsuario: FieldRef<"Medico", 'String'>
    readonly especialidadId: FieldRef<"Medico", 'String'>
    readonly turno: FieldRef<"Medico", 'Turno'>
    readonly activo: FieldRef<"Medico", 'Boolean'>
    readonly createdAt: FieldRef<"Medico", 'DateTime'>
    readonly updatedAt: FieldRef<"Medico", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Medico findUnique
   */
  export type MedicoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medico
     */
    select?: MedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicoInclude<ExtArgs> | null
    /**
     * Filter, which Medico to fetch.
     */
    where: MedicoWhereUniqueInput
  }

  /**
   * Medico findUniqueOrThrow
   */
  export type MedicoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medico
     */
    select?: MedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicoInclude<ExtArgs> | null
    /**
     * Filter, which Medico to fetch.
     */
    where: MedicoWhereUniqueInput
  }

  /**
   * Medico findFirst
   */
  export type MedicoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medico
     */
    select?: MedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicoInclude<ExtArgs> | null
    /**
     * Filter, which Medico to fetch.
     */
    where?: MedicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Medicos to fetch.
     */
    orderBy?: MedicoOrderByWithRelationInput | MedicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Medicos.
     */
    cursor?: MedicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Medicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Medicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Medicos.
     */
    distinct?: MedicoScalarFieldEnum | MedicoScalarFieldEnum[]
  }

  /**
   * Medico findFirstOrThrow
   */
  export type MedicoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medico
     */
    select?: MedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicoInclude<ExtArgs> | null
    /**
     * Filter, which Medico to fetch.
     */
    where?: MedicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Medicos to fetch.
     */
    orderBy?: MedicoOrderByWithRelationInput | MedicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Medicos.
     */
    cursor?: MedicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Medicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Medicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Medicos.
     */
    distinct?: MedicoScalarFieldEnum | MedicoScalarFieldEnum[]
  }

  /**
   * Medico findMany
   */
  export type MedicoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medico
     */
    select?: MedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicoInclude<ExtArgs> | null
    /**
     * Filter, which Medicos to fetch.
     */
    where?: MedicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Medicos to fetch.
     */
    orderBy?: MedicoOrderByWithRelationInput | MedicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Medicos.
     */
    cursor?: MedicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Medicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Medicos.
     */
    skip?: number
    distinct?: MedicoScalarFieldEnum | MedicoScalarFieldEnum[]
  }

  /**
   * Medico create
   */
  export type MedicoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medico
     */
    select?: MedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicoInclude<ExtArgs> | null
    /**
     * The data needed to create a Medico.
     */
    data: XOR<MedicoCreateInput, MedicoUncheckedCreateInput>
  }

  /**
   * Medico createMany
   */
  export type MedicoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Medicos.
     */
    data: MedicoCreateManyInput | MedicoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Medico createManyAndReturn
   */
  export type MedicoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medico
     */
    select?: MedicoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Medicos.
     */
    data: MedicoCreateManyInput | MedicoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Medico update
   */
  export type MedicoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medico
     */
    select?: MedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicoInclude<ExtArgs> | null
    /**
     * The data needed to update a Medico.
     */
    data: XOR<MedicoUpdateInput, MedicoUncheckedUpdateInput>
    /**
     * Choose, which Medico to update.
     */
    where: MedicoWhereUniqueInput
  }

  /**
   * Medico updateMany
   */
  export type MedicoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Medicos.
     */
    data: XOR<MedicoUpdateManyMutationInput, MedicoUncheckedUpdateManyInput>
    /**
     * Filter which Medicos to update
     */
    where?: MedicoWhereInput
  }

  /**
   * Medico upsert
   */
  export type MedicoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medico
     */
    select?: MedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicoInclude<ExtArgs> | null
    /**
     * The filter to search for the Medico to update in case it exists.
     */
    where: MedicoWhereUniqueInput
    /**
     * In case the Medico found by the `where` argument doesn't exist, create a new Medico with this data.
     */
    create: XOR<MedicoCreateInput, MedicoUncheckedCreateInput>
    /**
     * In case the Medico was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MedicoUpdateInput, MedicoUncheckedUpdateInput>
  }

  /**
   * Medico delete
   */
  export type MedicoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medico
     */
    select?: MedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicoInclude<ExtArgs> | null
    /**
     * Filter which Medico to delete.
     */
    where: MedicoWhereUniqueInput
  }

  /**
   * Medico deleteMany
   */
  export type MedicoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Medicos to delete
     */
    where?: MedicoWhereInput
  }

  /**
   * Medico.horarios
   */
  export type Medico$horariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HorarioMedico
     */
    select?: HorarioMedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HorarioMedicoInclude<ExtArgs> | null
    where?: HorarioMedicoWhereInput
    orderBy?: HorarioMedicoOrderByWithRelationInput | HorarioMedicoOrderByWithRelationInput[]
    cursor?: HorarioMedicoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: HorarioMedicoScalarFieldEnum | HorarioMedicoScalarFieldEnum[]
  }

  /**
   * Medico.citas
   */
  export type Medico$citasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cita
     */
    select?: CitaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitaInclude<ExtArgs> | null
    where?: CitaWhereInput
    orderBy?: CitaOrderByWithRelationInput | CitaOrderByWithRelationInput[]
    cursor?: CitaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CitaScalarFieldEnum | CitaScalarFieldEnum[]
  }

  /**
   * Medico without action
   */
  export type MedicoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medico
     */
    select?: MedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicoInclude<ExtArgs> | null
  }


  /**
   * Model HorarioMedico
   */

  export type AggregateHorarioMedico = {
    _count: HorarioMedicoCountAggregateOutputType | null
    _avg: HorarioMedicoAvgAggregateOutputType | null
    _sum: HorarioMedicoSumAggregateOutputType | null
    _min: HorarioMedicoMinAggregateOutputType | null
    _max: HorarioMedicoMaxAggregateOutputType | null
  }

  export type HorarioMedicoAvgAggregateOutputType = {
    diaSemana: number | null
    duracionSlot: number | null
  }

  export type HorarioMedicoSumAggregateOutputType = {
    diaSemana: number | null
    duracionSlot: number | null
  }

  export type HorarioMedicoMinAggregateOutputType = {
    id: string | null
    medicoId: string | null
    diaSemana: number | null
    horaInicio: string | null
    horaFin: string | null
    duracionSlot: number | null
    createdAt: Date | null
  }

  export type HorarioMedicoMaxAggregateOutputType = {
    id: string | null
    medicoId: string | null
    diaSemana: number | null
    horaInicio: string | null
    horaFin: string | null
    duracionSlot: number | null
    createdAt: Date | null
  }

  export type HorarioMedicoCountAggregateOutputType = {
    id: number
    medicoId: number
    diaSemana: number
    horaInicio: number
    horaFin: number
    duracionSlot: number
    createdAt: number
    _all: number
  }


  export type HorarioMedicoAvgAggregateInputType = {
    diaSemana?: true
    duracionSlot?: true
  }

  export type HorarioMedicoSumAggregateInputType = {
    diaSemana?: true
    duracionSlot?: true
  }

  export type HorarioMedicoMinAggregateInputType = {
    id?: true
    medicoId?: true
    diaSemana?: true
    horaInicio?: true
    horaFin?: true
    duracionSlot?: true
    createdAt?: true
  }

  export type HorarioMedicoMaxAggregateInputType = {
    id?: true
    medicoId?: true
    diaSemana?: true
    horaInicio?: true
    horaFin?: true
    duracionSlot?: true
    createdAt?: true
  }

  export type HorarioMedicoCountAggregateInputType = {
    id?: true
    medicoId?: true
    diaSemana?: true
    horaInicio?: true
    horaFin?: true
    duracionSlot?: true
    createdAt?: true
    _all?: true
  }

  export type HorarioMedicoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HorarioMedico to aggregate.
     */
    where?: HorarioMedicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HorarioMedicos to fetch.
     */
    orderBy?: HorarioMedicoOrderByWithRelationInput | HorarioMedicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HorarioMedicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HorarioMedicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HorarioMedicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HorarioMedicos
    **/
    _count?: true | HorarioMedicoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: HorarioMedicoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: HorarioMedicoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HorarioMedicoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HorarioMedicoMaxAggregateInputType
  }

  export type GetHorarioMedicoAggregateType<T extends HorarioMedicoAggregateArgs> = {
        [P in keyof T & keyof AggregateHorarioMedico]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHorarioMedico[P]>
      : GetScalarType<T[P], AggregateHorarioMedico[P]>
  }




  export type HorarioMedicoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HorarioMedicoWhereInput
    orderBy?: HorarioMedicoOrderByWithAggregationInput | HorarioMedicoOrderByWithAggregationInput[]
    by: HorarioMedicoScalarFieldEnum[] | HorarioMedicoScalarFieldEnum
    having?: HorarioMedicoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HorarioMedicoCountAggregateInputType | true
    _avg?: HorarioMedicoAvgAggregateInputType
    _sum?: HorarioMedicoSumAggregateInputType
    _min?: HorarioMedicoMinAggregateInputType
    _max?: HorarioMedicoMaxAggregateInputType
  }

  export type HorarioMedicoGroupByOutputType = {
    id: string
    medicoId: string
    diaSemana: number
    horaInicio: string
    horaFin: string
    duracionSlot: number
    createdAt: Date
    _count: HorarioMedicoCountAggregateOutputType | null
    _avg: HorarioMedicoAvgAggregateOutputType | null
    _sum: HorarioMedicoSumAggregateOutputType | null
    _min: HorarioMedicoMinAggregateOutputType | null
    _max: HorarioMedicoMaxAggregateOutputType | null
  }

  type GetHorarioMedicoGroupByPayload<T extends HorarioMedicoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HorarioMedicoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HorarioMedicoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HorarioMedicoGroupByOutputType[P]>
            : GetScalarType<T[P], HorarioMedicoGroupByOutputType[P]>
        }
      >
    >


  export type HorarioMedicoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    medicoId?: boolean
    diaSemana?: boolean
    horaInicio?: boolean
    horaFin?: boolean
    duracionSlot?: boolean
    createdAt?: boolean
    medico?: boolean | MedicoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["horarioMedico"]>

  export type HorarioMedicoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    medicoId?: boolean
    diaSemana?: boolean
    horaInicio?: boolean
    horaFin?: boolean
    duracionSlot?: boolean
    createdAt?: boolean
    medico?: boolean | MedicoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["horarioMedico"]>

  export type HorarioMedicoSelectScalar = {
    id?: boolean
    medicoId?: boolean
    diaSemana?: boolean
    horaInicio?: boolean
    horaFin?: boolean
    duracionSlot?: boolean
    createdAt?: boolean
  }

  export type HorarioMedicoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    medico?: boolean | MedicoDefaultArgs<ExtArgs>
  }
  export type HorarioMedicoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    medico?: boolean | MedicoDefaultArgs<ExtArgs>
  }

  export type $HorarioMedicoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HorarioMedico"
    objects: {
      medico: Prisma.$MedicoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      medicoId: string
      diaSemana: number
      horaInicio: string
      horaFin: string
      duracionSlot: number
      createdAt: Date
    }, ExtArgs["result"]["horarioMedico"]>
    composites: {}
  }

  type HorarioMedicoGetPayload<S extends boolean | null | undefined | HorarioMedicoDefaultArgs> = $Result.GetResult<Prisma.$HorarioMedicoPayload, S>

  type HorarioMedicoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<HorarioMedicoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: HorarioMedicoCountAggregateInputType | true
    }

  export interface HorarioMedicoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HorarioMedico'], meta: { name: 'HorarioMedico' } }
    /**
     * Find zero or one HorarioMedico that matches the filter.
     * @param {HorarioMedicoFindUniqueArgs} args - Arguments to find a HorarioMedico
     * @example
     * // Get one HorarioMedico
     * const horarioMedico = await prisma.horarioMedico.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HorarioMedicoFindUniqueArgs>(args: SelectSubset<T, HorarioMedicoFindUniqueArgs<ExtArgs>>): Prisma__HorarioMedicoClient<$Result.GetResult<Prisma.$HorarioMedicoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one HorarioMedico that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {HorarioMedicoFindUniqueOrThrowArgs} args - Arguments to find a HorarioMedico
     * @example
     * // Get one HorarioMedico
     * const horarioMedico = await prisma.horarioMedico.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HorarioMedicoFindUniqueOrThrowArgs>(args: SelectSubset<T, HorarioMedicoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HorarioMedicoClient<$Result.GetResult<Prisma.$HorarioMedicoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first HorarioMedico that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HorarioMedicoFindFirstArgs} args - Arguments to find a HorarioMedico
     * @example
     * // Get one HorarioMedico
     * const horarioMedico = await prisma.horarioMedico.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HorarioMedicoFindFirstArgs>(args?: SelectSubset<T, HorarioMedicoFindFirstArgs<ExtArgs>>): Prisma__HorarioMedicoClient<$Result.GetResult<Prisma.$HorarioMedicoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first HorarioMedico that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HorarioMedicoFindFirstOrThrowArgs} args - Arguments to find a HorarioMedico
     * @example
     * // Get one HorarioMedico
     * const horarioMedico = await prisma.horarioMedico.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HorarioMedicoFindFirstOrThrowArgs>(args?: SelectSubset<T, HorarioMedicoFindFirstOrThrowArgs<ExtArgs>>): Prisma__HorarioMedicoClient<$Result.GetResult<Prisma.$HorarioMedicoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more HorarioMedicos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HorarioMedicoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HorarioMedicos
     * const horarioMedicos = await prisma.horarioMedico.findMany()
     * 
     * // Get first 10 HorarioMedicos
     * const horarioMedicos = await prisma.horarioMedico.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const horarioMedicoWithIdOnly = await prisma.horarioMedico.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HorarioMedicoFindManyArgs>(args?: SelectSubset<T, HorarioMedicoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HorarioMedicoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a HorarioMedico.
     * @param {HorarioMedicoCreateArgs} args - Arguments to create a HorarioMedico.
     * @example
     * // Create one HorarioMedico
     * const HorarioMedico = await prisma.horarioMedico.create({
     *   data: {
     *     // ... data to create a HorarioMedico
     *   }
     * })
     * 
     */
    create<T extends HorarioMedicoCreateArgs>(args: SelectSubset<T, HorarioMedicoCreateArgs<ExtArgs>>): Prisma__HorarioMedicoClient<$Result.GetResult<Prisma.$HorarioMedicoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many HorarioMedicos.
     * @param {HorarioMedicoCreateManyArgs} args - Arguments to create many HorarioMedicos.
     * @example
     * // Create many HorarioMedicos
     * const horarioMedico = await prisma.horarioMedico.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HorarioMedicoCreateManyArgs>(args?: SelectSubset<T, HorarioMedicoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HorarioMedicos and returns the data saved in the database.
     * @param {HorarioMedicoCreateManyAndReturnArgs} args - Arguments to create many HorarioMedicos.
     * @example
     * // Create many HorarioMedicos
     * const horarioMedico = await prisma.horarioMedico.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HorarioMedicos and only return the `id`
     * const horarioMedicoWithIdOnly = await prisma.horarioMedico.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HorarioMedicoCreateManyAndReturnArgs>(args?: SelectSubset<T, HorarioMedicoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HorarioMedicoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a HorarioMedico.
     * @param {HorarioMedicoDeleteArgs} args - Arguments to delete one HorarioMedico.
     * @example
     * // Delete one HorarioMedico
     * const HorarioMedico = await prisma.horarioMedico.delete({
     *   where: {
     *     // ... filter to delete one HorarioMedico
     *   }
     * })
     * 
     */
    delete<T extends HorarioMedicoDeleteArgs>(args: SelectSubset<T, HorarioMedicoDeleteArgs<ExtArgs>>): Prisma__HorarioMedicoClient<$Result.GetResult<Prisma.$HorarioMedicoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one HorarioMedico.
     * @param {HorarioMedicoUpdateArgs} args - Arguments to update one HorarioMedico.
     * @example
     * // Update one HorarioMedico
     * const horarioMedico = await prisma.horarioMedico.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HorarioMedicoUpdateArgs>(args: SelectSubset<T, HorarioMedicoUpdateArgs<ExtArgs>>): Prisma__HorarioMedicoClient<$Result.GetResult<Prisma.$HorarioMedicoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more HorarioMedicos.
     * @param {HorarioMedicoDeleteManyArgs} args - Arguments to filter HorarioMedicos to delete.
     * @example
     * // Delete a few HorarioMedicos
     * const { count } = await prisma.horarioMedico.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HorarioMedicoDeleteManyArgs>(args?: SelectSubset<T, HorarioMedicoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HorarioMedicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HorarioMedicoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HorarioMedicos
     * const horarioMedico = await prisma.horarioMedico.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HorarioMedicoUpdateManyArgs>(args: SelectSubset<T, HorarioMedicoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one HorarioMedico.
     * @param {HorarioMedicoUpsertArgs} args - Arguments to update or create a HorarioMedico.
     * @example
     * // Update or create a HorarioMedico
     * const horarioMedico = await prisma.horarioMedico.upsert({
     *   create: {
     *     // ... data to create a HorarioMedico
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HorarioMedico we want to update
     *   }
     * })
     */
    upsert<T extends HorarioMedicoUpsertArgs>(args: SelectSubset<T, HorarioMedicoUpsertArgs<ExtArgs>>): Prisma__HorarioMedicoClient<$Result.GetResult<Prisma.$HorarioMedicoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of HorarioMedicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HorarioMedicoCountArgs} args - Arguments to filter HorarioMedicos to count.
     * @example
     * // Count the number of HorarioMedicos
     * const count = await prisma.horarioMedico.count({
     *   where: {
     *     // ... the filter for the HorarioMedicos we want to count
     *   }
     * })
    **/
    count<T extends HorarioMedicoCountArgs>(
      args?: Subset<T, HorarioMedicoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HorarioMedicoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HorarioMedico.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HorarioMedicoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HorarioMedicoAggregateArgs>(args: Subset<T, HorarioMedicoAggregateArgs>): Prisma.PrismaPromise<GetHorarioMedicoAggregateType<T>>

    /**
     * Group by HorarioMedico.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HorarioMedicoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HorarioMedicoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HorarioMedicoGroupByArgs['orderBy'] }
        : { orderBy?: HorarioMedicoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HorarioMedicoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHorarioMedicoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HorarioMedico model
   */
  readonly fields: HorarioMedicoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HorarioMedico.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HorarioMedicoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    medico<T extends MedicoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MedicoDefaultArgs<ExtArgs>>): Prisma__MedicoClient<$Result.GetResult<Prisma.$MedicoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the HorarioMedico model
   */ 
  interface HorarioMedicoFieldRefs {
    readonly id: FieldRef<"HorarioMedico", 'String'>
    readonly medicoId: FieldRef<"HorarioMedico", 'String'>
    readonly diaSemana: FieldRef<"HorarioMedico", 'Int'>
    readonly horaInicio: FieldRef<"HorarioMedico", 'String'>
    readonly horaFin: FieldRef<"HorarioMedico", 'String'>
    readonly duracionSlot: FieldRef<"HorarioMedico", 'Int'>
    readonly createdAt: FieldRef<"HorarioMedico", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * HorarioMedico findUnique
   */
  export type HorarioMedicoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HorarioMedico
     */
    select?: HorarioMedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HorarioMedicoInclude<ExtArgs> | null
    /**
     * Filter, which HorarioMedico to fetch.
     */
    where: HorarioMedicoWhereUniqueInput
  }

  /**
   * HorarioMedico findUniqueOrThrow
   */
  export type HorarioMedicoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HorarioMedico
     */
    select?: HorarioMedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HorarioMedicoInclude<ExtArgs> | null
    /**
     * Filter, which HorarioMedico to fetch.
     */
    where: HorarioMedicoWhereUniqueInput
  }

  /**
   * HorarioMedico findFirst
   */
  export type HorarioMedicoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HorarioMedico
     */
    select?: HorarioMedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HorarioMedicoInclude<ExtArgs> | null
    /**
     * Filter, which HorarioMedico to fetch.
     */
    where?: HorarioMedicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HorarioMedicos to fetch.
     */
    orderBy?: HorarioMedicoOrderByWithRelationInput | HorarioMedicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HorarioMedicos.
     */
    cursor?: HorarioMedicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HorarioMedicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HorarioMedicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HorarioMedicos.
     */
    distinct?: HorarioMedicoScalarFieldEnum | HorarioMedicoScalarFieldEnum[]
  }

  /**
   * HorarioMedico findFirstOrThrow
   */
  export type HorarioMedicoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HorarioMedico
     */
    select?: HorarioMedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HorarioMedicoInclude<ExtArgs> | null
    /**
     * Filter, which HorarioMedico to fetch.
     */
    where?: HorarioMedicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HorarioMedicos to fetch.
     */
    orderBy?: HorarioMedicoOrderByWithRelationInput | HorarioMedicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HorarioMedicos.
     */
    cursor?: HorarioMedicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HorarioMedicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HorarioMedicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HorarioMedicos.
     */
    distinct?: HorarioMedicoScalarFieldEnum | HorarioMedicoScalarFieldEnum[]
  }

  /**
   * HorarioMedico findMany
   */
  export type HorarioMedicoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HorarioMedico
     */
    select?: HorarioMedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HorarioMedicoInclude<ExtArgs> | null
    /**
     * Filter, which HorarioMedicos to fetch.
     */
    where?: HorarioMedicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HorarioMedicos to fetch.
     */
    orderBy?: HorarioMedicoOrderByWithRelationInput | HorarioMedicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HorarioMedicos.
     */
    cursor?: HorarioMedicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HorarioMedicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HorarioMedicos.
     */
    skip?: number
    distinct?: HorarioMedicoScalarFieldEnum | HorarioMedicoScalarFieldEnum[]
  }

  /**
   * HorarioMedico create
   */
  export type HorarioMedicoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HorarioMedico
     */
    select?: HorarioMedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HorarioMedicoInclude<ExtArgs> | null
    /**
     * The data needed to create a HorarioMedico.
     */
    data: XOR<HorarioMedicoCreateInput, HorarioMedicoUncheckedCreateInput>
  }

  /**
   * HorarioMedico createMany
   */
  export type HorarioMedicoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HorarioMedicos.
     */
    data: HorarioMedicoCreateManyInput | HorarioMedicoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HorarioMedico createManyAndReturn
   */
  export type HorarioMedicoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HorarioMedico
     */
    select?: HorarioMedicoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many HorarioMedicos.
     */
    data: HorarioMedicoCreateManyInput | HorarioMedicoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HorarioMedicoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * HorarioMedico update
   */
  export type HorarioMedicoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HorarioMedico
     */
    select?: HorarioMedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HorarioMedicoInclude<ExtArgs> | null
    /**
     * The data needed to update a HorarioMedico.
     */
    data: XOR<HorarioMedicoUpdateInput, HorarioMedicoUncheckedUpdateInput>
    /**
     * Choose, which HorarioMedico to update.
     */
    where: HorarioMedicoWhereUniqueInput
  }

  /**
   * HorarioMedico updateMany
   */
  export type HorarioMedicoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HorarioMedicos.
     */
    data: XOR<HorarioMedicoUpdateManyMutationInput, HorarioMedicoUncheckedUpdateManyInput>
    /**
     * Filter which HorarioMedicos to update
     */
    where?: HorarioMedicoWhereInput
  }

  /**
   * HorarioMedico upsert
   */
  export type HorarioMedicoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HorarioMedico
     */
    select?: HorarioMedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HorarioMedicoInclude<ExtArgs> | null
    /**
     * The filter to search for the HorarioMedico to update in case it exists.
     */
    where: HorarioMedicoWhereUniqueInput
    /**
     * In case the HorarioMedico found by the `where` argument doesn't exist, create a new HorarioMedico with this data.
     */
    create: XOR<HorarioMedicoCreateInput, HorarioMedicoUncheckedCreateInput>
    /**
     * In case the HorarioMedico was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HorarioMedicoUpdateInput, HorarioMedicoUncheckedUpdateInput>
  }

  /**
   * HorarioMedico delete
   */
  export type HorarioMedicoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HorarioMedico
     */
    select?: HorarioMedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HorarioMedicoInclude<ExtArgs> | null
    /**
     * Filter which HorarioMedico to delete.
     */
    where: HorarioMedicoWhereUniqueInput
  }

  /**
   * HorarioMedico deleteMany
   */
  export type HorarioMedicoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HorarioMedicos to delete
     */
    where?: HorarioMedicoWhereInput
  }

  /**
   * HorarioMedico without action
   */
  export type HorarioMedicoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HorarioMedico
     */
    select?: HorarioMedicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HorarioMedicoInclude<ExtArgs> | null
  }


  /**
   * Model Cita
   */

  export type AggregateCita = {
    _count: CitaCountAggregateOutputType | null
    _min: CitaMinAggregateOutputType | null
    _max: CitaMaxAggregateOutputType | null
  }

  export type CitaMinAggregateOutputType = {
    id: string | null
    pacienteId: string | null
    medicoId: string | null
    fechaHora: Date | null
    estado: $Enums.EstadoCita | null
    tipoReserva: $Enums.TipoReserva | null
    motivo: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CitaMaxAggregateOutputType = {
    id: string | null
    pacienteId: string | null
    medicoId: string | null
    fechaHora: Date | null
    estado: $Enums.EstadoCita | null
    tipoReserva: $Enums.TipoReserva | null
    motivo: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CitaCountAggregateOutputType = {
    id: number
    pacienteId: number
    medicoId: number
    fechaHora: number
    estado: number
    tipoReserva: number
    motivo: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CitaMinAggregateInputType = {
    id?: true
    pacienteId?: true
    medicoId?: true
    fechaHora?: true
    estado?: true
    tipoReserva?: true
    motivo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CitaMaxAggregateInputType = {
    id?: true
    pacienteId?: true
    medicoId?: true
    fechaHora?: true
    estado?: true
    tipoReserva?: true
    motivo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CitaCountAggregateInputType = {
    id?: true
    pacienteId?: true
    medicoId?: true
    fechaHora?: true
    estado?: true
    tipoReserva?: true
    motivo?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CitaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cita to aggregate.
     */
    where?: CitaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Citas to fetch.
     */
    orderBy?: CitaOrderByWithRelationInput | CitaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CitaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Citas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Citas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Citas
    **/
    _count?: true | CitaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CitaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CitaMaxAggregateInputType
  }

  export type GetCitaAggregateType<T extends CitaAggregateArgs> = {
        [P in keyof T & keyof AggregateCita]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCita[P]>
      : GetScalarType<T[P], AggregateCita[P]>
  }




  export type CitaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CitaWhereInput
    orderBy?: CitaOrderByWithAggregationInput | CitaOrderByWithAggregationInput[]
    by: CitaScalarFieldEnum[] | CitaScalarFieldEnum
    having?: CitaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CitaCountAggregateInputType | true
    _min?: CitaMinAggregateInputType
    _max?: CitaMaxAggregateInputType
  }

  export type CitaGroupByOutputType = {
    id: string
    pacienteId: string
    medicoId: string
    fechaHora: Date
    estado: $Enums.EstadoCita
    tipoReserva: $Enums.TipoReserva
    motivo: string | null
    createdAt: Date
    updatedAt: Date
    _count: CitaCountAggregateOutputType | null
    _min: CitaMinAggregateOutputType | null
    _max: CitaMaxAggregateOutputType | null
  }

  type GetCitaGroupByPayload<T extends CitaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CitaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CitaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CitaGroupByOutputType[P]>
            : GetScalarType<T[P], CitaGroupByOutputType[P]>
        }
      >
    >


  export type CitaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pacienteId?: boolean
    medicoId?: boolean
    fechaHora?: boolean
    estado?: boolean
    tipoReserva?: boolean
    motivo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    medico?: boolean | MedicoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cita"]>

  export type CitaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pacienteId?: boolean
    medicoId?: boolean
    fechaHora?: boolean
    estado?: boolean
    tipoReserva?: boolean
    motivo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    medico?: boolean | MedicoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cita"]>

  export type CitaSelectScalar = {
    id?: boolean
    pacienteId?: boolean
    medicoId?: boolean
    fechaHora?: boolean
    estado?: boolean
    tipoReserva?: boolean
    motivo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CitaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    medico?: boolean | MedicoDefaultArgs<ExtArgs>
  }
  export type CitaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    medico?: boolean | MedicoDefaultArgs<ExtArgs>
  }

  export type $CitaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Cita"
    objects: {
      medico: Prisma.$MedicoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      pacienteId: string
      medicoId: string
      fechaHora: Date
      estado: $Enums.EstadoCita
      tipoReserva: $Enums.TipoReserva
      motivo: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cita"]>
    composites: {}
  }

  type CitaGetPayload<S extends boolean | null | undefined | CitaDefaultArgs> = $Result.GetResult<Prisma.$CitaPayload, S>

  type CitaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CitaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CitaCountAggregateInputType | true
    }

  export interface CitaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Cita'], meta: { name: 'Cita' } }
    /**
     * Find zero or one Cita that matches the filter.
     * @param {CitaFindUniqueArgs} args - Arguments to find a Cita
     * @example
     * // Get one Cita
     * const cita = await prisma.cita.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CitaFindUniqueArgs>(args: SelectSubset<T, CitaFindUniqueArgs<ExtArgs>>): Prisma__CitaClient<$Result.GetResult<Prisma.$CitaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Cita that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CitaFindUniqueOrThrowArgs} args - Arguments to find a Cita
     * @example
     * // Get one Cita
     * const cita = await prisma.cita.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CitaFindUniqueOrThrowArgs>(args: SelectSubset<T, CitaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CitaClient<$Result.GetResult<Prisma.$CitaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Cita that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CitaFindFirstArgs} args - Arguments to find a Cita
     * @example
     * // Get one Cita
     * const cita = await prisma.cita.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CitaFindFirstArgs>(args?: SelectSubset<T, CitaFindFirstArgs<ExtArgs>>): Prisma__CitaClient<$Result.GetResult<Prisma.$CitaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Cita that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CitaFindFirstOrThrowArgs} args - Arguments to find a Cita
     * @example
     * // Get one Cita
     * const cita = await prisma.cita.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CitaFindFirstOrThrowArgs>(args?: SelectSubset<T, CitaFindFirstOrThrowArgs<ExtArgs>>): Prisma__CitaClient<$Result.GetResult<Prisma.$CitaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Citas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CitaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Citas
     * const citas = await prisma.cita.findMany()
     * 
     * // Get first 10 Citas
     * const citas = await prisma.cita.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const citaWithIdOnly = await prisma.cita.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CitaFindManyArgs>(args?: SelectSubset<T, CitaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CitaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Cita.
     * @param {CitaCreateArgs} args - Arguments to create a Cita.
     * @example
     * // Create one Cita
     * const Cita = await prisma.cita.create({
     *   data: {
     *     // ... data to create a Cita
     *   }
     * })
     * 
     */
    create<T extends CitaCreateArgs>(args: SelectSubset<T, CitaCreateArgs<ExtArgs>>): Prisma__CitaClient<$Result.GetResult<Prisma.$CitaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Citas.
     * @param {CitaCreateManyArgs} args - Arguments to create many Citas.
     * @example
     * // Create many Citas
     * const cita = await prisma.cita.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CitaCreateManyArgs>(args?: SelectSubset<T, CitaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Citas and returns the data saved in the database.
     * @param {CitaCreateManyAndReturnArgs} args - Arguments to create many Citas.
     * @example
     * // Create many Citas
     * const cita = await prisma.cita.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Citas and only return the `id`
     * const citaWithIdOnly = await prisma.cita.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CitaCreateManyAndReturnArgs>(args?: SelectSubset<T, CitaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CitaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Cita.
     * @param {CitaDeleteArgs} args - Arguments to delete one Cita.
     * @example
     * // Delete one Cita
     * const Cita = await prisma.cita.delete({
     *   where: {
     *     // ... filter to delete one Cita
     *   }
     * })
     * 
     */
    delete<T extends CitaDeleteArgs>(args: SelectSubset<T, CitaDeleteArgs<ExtArgs>>): Prisma__CitaClient<$Result.GetResult<Prisma.$CitaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Cita.
     * @param {CitaUpdateArgs} args - Arguments to update one Cita.
     * @example
     * // Update one Cita
     * const cita = await prisma.cita.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CitaUpdateArgs>(args: SelectSubset<T, CitaUpdateArgs<ExtArgs>>): Prisma__CitaClient<$Result.GetResult<Prisma.$CitaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Citas.
     * @param {CitaDeleteManyArgs} args - Arguments to filter Citas to delete.
     * @example
     * // Delete a few Citas
     * const { count } = await prisma.cita.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CitaDeleteManyArgs>(args?: SelectSubset<T, CitaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Citas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CitaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Citas
     * const cita = await prisma.cita.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CitaUpdateManyArgs>(args: SelectSubset<T, CitaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Cita.
     * @param {CitaUpsertArgs} args - Arguments to update or create a Cita.
     * @example
     * // Update or create a Cita
     * const cita = await prisma.cita.upsert({
     *   create: {
     *     // ... data to create a Cita
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Cita we want to update
     *   }
     * })
     */
    upsert<T extends CitaUpsertArgs>(args: SelectSubset<T, CitaUpsertArgs<ExtArgs>>): Prisma__CitaClient<$Result.GetResult<Prisma.$CitaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Citas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CitaCountArgs} args - Arguments to filter Citas to count.
     * @example
     * // Count the number of Citas
     * const count = await prisma.cita.count({
     *   where: {
     *     // ... the filter for the Citas we want to count
     *   }
     * })
    **/
    count<T extends CitaCountArgs>(
      args?: Subset<T, CitaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CitaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Cita.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CitaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CitaAggregateArgs>(args: Subset<T, CitaAggregateArgs>): Prisma.PrismaPromise<GetCitaAggregateType<T>>

    /**
     * Group by Cita.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CitaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CitaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CitaGroupByArgs['orderBy'] }
        : { orderBy?: CitaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CitaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCitaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Cita model
   */
  readonly fields: CitaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Cita.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CitaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    medico<T extends MedicoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MedicoDefaultArgs<ExtArgs>>): Prisma__MedicoClient<$Result.GetResult<Prisma.$MedicoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Cita model
   */ 
  interface CitaFieldRefs {
    readonly id: FieldRef<"Cita", 'String'>
    readonly pacienteId: FieldRef<"Cita", 'String'>
    readonly medicoId: FieldRef<"Cita", 'String'>
    readonly fechaHora: FieldRef<"Cita", 'DateTime'>
    readonly estado: FieldRef<"Cita", 'EstadoCita'>
    readonly tipoReserva: FieldRef<"Cita", 'TipoReserva'>
    readonly motivo: FieldRef<"Cita", 'String'>
    readonly createdAt: FieldRef<"Cita", 'DateTime'>
    readonly updatedAt: FieldRef<"Cita", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Cita findUnique
   */
  export type CitaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cita
     */
    select?: CitaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitaInclude<ExtArgs> | null
    /**
     * Filter, which Cita to fetch.
     */
    where: CitaWhereUniqueInput
  }

  /**
   * Cita findUniqueOrThrow
   */
  export type CitaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cita
     */
    select?: CitaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitaInclude<ExtArgs> | null
    /**
     * Filter, which Cita to fetch.
     */
    where: CitaWhereUniqueInput
  }

  /**
   * Cita findFirst
   */
  export type CitaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cita
     */
    select?: CitaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitaInclude<ExtArgs> | null
    /**
     * Filter, which Cita to fetch.
     */
    where?: CitaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Citas to fetch.
     */
    orderBy?: CitaOrderByWithRelationInput | CitaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Citas.
     */
    cursor?: CitaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Citas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Citas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Citas.
     */
    distinct?: CitaScalarFieldEnum | CitaScalarFieldEnum[]
  }

  /**
   * Cita findFirstOrThrow
   */
  export type CitaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cita
     */
    select?: CitaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitaInclude<ExtArgs> | null
    /**
     * Filter, which Cita to fetch.
     */
    where?: CitaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Citas to fetch.
     */
    orderBy?: CitaOrderByWithRelationInput | CitaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Citas.
     */
    cursor?: CitaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Citas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Citas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Citas.
     */
    distinct?: CitaScalarFieldEnum | CitaScalarFieldEnum[]
  }

  /**
   * Cita findMany
   */
  export type CitaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cita
     */
    select?: CitaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitaInclude<ExtArgs> | null
    /**
     * Filter, which Citas to fetch.
     */
    where?: CitaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Citas to fetch.
     */
    orderBy?: CitaOrderByWithRelationInput | CitaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Citas.
     */
    cursor?: CitaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Citas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Citas.
     */
    skip?: number
    distinct?: CitaScalarFieldEnum | CitaScalarFieldEnum[]
  }

  /**
   * Cita create
   */
  export type CitaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cita
     */
    select?: CitaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitaInclude<ExtArgs> | null
    /**
     * The data needed to create a Cita.
     */
    data: XOR<CitaCreateInput, CitaUncheckedCreateInput>
  }

  /**
   * Cita createMany
   */
  export type CitaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Citas.
     */
    data: CitaCreateManyInput | CitaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cita createManyAndReturn
   */
  export type CitaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cita
     */
    select?: CitaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Citas.
     */
    data: CitaCreateManyInput | CitaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Cita update
   */
  export type CitaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cita
     */
    select?: CitaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitaInclude<ExtArgs> | null
    /**
     * The data needed to update a Cita.
     */
    data: XOR<CitaUpdateInput, CitaUncheckedUpdateInput>
    /**
     * Choose, which Cita to update.
     */
    where: CitaWhereUniqueInput
  }

  /**
   * Cita updateMany
   */
  export type CitaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Citas.
     */
    data: XOR<CitaUpdateManyMutationInput, CitaUncheckedUpdateManyInput>
    /**
     * Filter which Citas to update
     */
    where?: CitaWhereInput
  }

  /**
   * Cita upsert
   */
  export type CitaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cita
     */
    select?: CitaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitaInclude<ExtArgs> | null
    /**
     * The filter to search for the Cita to update in case it exists.
     */
    where: CitaWhereUniqueInput
    /**
     * In case the Cita found by the `where` argument doesn't exist, create a new Cita with this data.
     */
    create: XOR<CitaCreateInput, CitaUncheckedCreateInput>
    /**
     * In case the Cita was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CitaUpdateInput, CitaUncheckedUpdateInput>
  }

  /**
   * Cita delete
   */
  export type CitaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cita
     */
    select?: CitaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitaInclude<ExtArgs> | null
    /**
     * Filter which Cita to delete.
     */
    where: CitaWhereUniqueInput
  }

  /**
   * Cita deleteMany
   */
  export type CitaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Citas to delete
     */
    where?: CitaWhereInput
  }

  /**
   * Cita without action
   */
  export type CitaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cita
     */
    select?: CitaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CitaInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const EspecialidadScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    createdAt: 'createdAt'
  };

  export type EspecialidadScalarFieldEnum = (typeof EspecialidadScalarFieldEnum)[keyof typeof EspecialidadScalarFieldEnum]


  export const MedicoScalarFieldEnum: {
    id: 'id',
    usuarioId: 'usuarioId',
    nombreUsuario: 'nombreUsuario',
    especialidadId: 'especialidadId',
    turno: 'turno',
    activo: 'activo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MedicoScalarFieldEnum = (typeof MedicoScalarFieldEnum)[keyof typeof MedicoScalarFieldEnum]


  export const HorarioMedicoScalarFieldEnum: {
    id: 'id',
    medicoId: 'medicoId',
    diaSemana: 'diaSemana',
    horaInicio: 'horaInicio',
    horaFin: 'horaFin',
    duracionSlot: 'duracionSlot',
    createdAt: 'createdAt'
  };

  export type HorarioMedicoScalarFieldEnum = (typeof HorarioMedicoScalarFieldEnum)[keyof typeof HorarioMedicoScalarFieldEnum]


  export const CitaScalarFieldEnum: {
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

  export type CitaScalarFieldEnum = (typeof CitaScalarFieldEnum)[keyof typeof CitaScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Turno'
   */
  export type EnumTurnoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Turno'>
    


  /**
   * Reference to a field of type 'Turno[]'
   */
  export type ListEnumTurnoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Turno[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'EstadoCita'
   */
  export type EnumEstadoCitaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EstadoCita'>
    


  /**
   * Reference to a field of type 'EstadoCita[]'
   */
  export type ListEnumEstadoCitaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EstadoCita[]'>
    


  /**
   * Reference to a field of type 'TipoReserva'
   */
  export type EnumTipoReservaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoReserva'>
    


  /**
   * Reference to a field of type 'TipoReserva[]'
   */
  export type ListEnumTipoReservaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoReserva[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type EspecialidadWhereInput = {
    AND?: EspecialidadWhereInput | EspecialidadWhereInput[]
    OR?: EspecialidadWhereInput[]
    NOT?: EspecialidadWhereInput | EspecialidadWhereInput[]
    id?: StringFilter<"Especialidad"> | string
    nombre?: StringFilter<"Especialidad"> | string
    createdAt?: DateTimeFilter<"Especialidad"> | Date | string
    medicos?: MedicoListRelationFilter
  }

  export type EspecialidadOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    createdAt?: SortOrder
    medicos?: MedicoOrderByRelationAggregateInput
  }

  export type EspecialidadWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    nombre?: string
    AND?: EspecialidadWhereInput | EspecialidadWhereInput[]
    OR?: EspecialidadWhereInput[]
    NOT?: EspecialidadWhereInput | EspecialidadWhereInput[]
    createdAt?: DateTimeFilter<"Especialidad"> | Date | string
    medicos?: MedicoListRelationFilter
  }, "id" | "nombre">

  export type EspecialidadOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    createdAt?: SortOrder
    _count?: EspecialidadCountOrderByAggregateInput
    _max?: EspecialidadMaxOrderByAggregateInput
    _min?: EspecialidadMinOrderByAggregateInput
  }

  export type EspecialidadScalarWhereWithAggregatesInput = {
    AND?: EspecialidadScalarWhereWithAggregatesInput | EspecialidadScalarWhereWithAggregatesInput[]
    OR?: EspecialidadScalarWhereWithAggregatesInput[]
    NOT?: EspecialidadScalarWhereWithAggregatesInput | EspecialidadScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Especialidad"> | string
    nombre?: StringWithAggregatesFilter<"Especialidad"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Especialidad"> | Date | string
  }

  export type MedicoWhereInput = {
    AND?: MedicoWhereInput | MedicoWhereInput[]
    OR?: MedicoWhereInput[]
    NOT?: MedicoWhereInput | MedicoWhereInput[]
    id?: StringFilter<"Medico"> | string
    usuarioId?: StringFilter<"Medico"> | string
    nombreUsuario?: StringFilter<"Medico"> | string
    especialidadId?: StringFilter<"Medico"> | string
    turno?: EnumTurnoFilter<"Medico"> | $Enums.Turno
    activo?: BoolFilter<"Medico"> | boolean
    createdAt?: DateTimeFilter<"Medico"> | Date | string
    updatedAt?: DateTimeFilter<"Medico"> | Date | string
    especialidad?: XOR<EspecialidadRelationFilter, EspecialidadWhereInput>
    horarios?: HorarioMedicoListRelationFilter
    citas?: CitaListRelationFilter
  }

  export type MedicoOrderByWithRelationInput = {
    id?: SortOrder
    usuarioId?: SortOrder
    nombreUsuario?: SortOrder
    especialidadId?: SortOrder
    turno?: SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    especialidad?: EspecialidadOrderByWithRelationInput
    horarios?: HorarioMedicoOrderByRelationAggregateInput
    citas?: CitaOrderByRelationAggregateInput
  }

  export type MedicoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    usuarioId?: string
    nombreUsuario?: string
    AND?: MedicoWhereInput | MedicoWhereInput[]
    OR?: MedicoWhereInput[]
    NOT?: MedicoWhereInput | MedicoWhereInput[]
    especialidadId?: StringFilter<"Medico"> | string
    turno?: EnumTurnoFilter<"Medico"> | $Enums.Turno
    activo?: BoolFilter<"Medico"> | boolean
    createdAt?: DateTimeFilter<"Medico"> | Date | string
    updatedAt?: DateTimeFilter<"Medico"> | Date | string
    especialidad?: XOR<EspecialidadRelationFilter, EspecialidadWhereInput>
    horarios?: HorarioMedicoListRelationFilter
    citas?: CitaListRelationFilter
  }, "id" | "usuarioId" | "nombreUsuario">

  export type MedicoOrderByWithAggregationInput = {
    id?: SortOrder
    usuarioId?: SortOrder
    nombreUsuario?: SortOrder
    especialidadId?: SortOrder
    turno?: SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MedicoCountOrderByAggregateInput
    _max?: MedicoMaxOrderByAggregateInput
    _min?: MedicoMinOrderByAggregateInput
  }

  export type MedicoScalarWhereWithAggregatesInput = {
    AND?: MedicoScalarWhereWithAggregatesInput | MedicoScalarWhereWithAggregatesInput[]
    OR?: MedicoScalarWhereWithAggregatesInput[]
    NOT?: MedicoScalarWhereWithAggregatesInput | MedicoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Medico"> | string
    usuarioId?: StringWithAggregatesFilter<"Medico"> | string
    nombreUsuario?: StringWithAggregatesFilter<"Medico"> | string
    especialidadId?: StringWithAggregatesFilter<"Medico"> | string
    turno?: EnumTurnoWithAggregatesFilter<"Medico"> | $Enums.Turno
    activo?: BoolWithAggregatesFilter<"Medico"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Medico"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Medico"> | Date | string
  }

  export type HorarioMedicoWhereInput = {
    AND?: HorarioMedicoWhereInput | HorarioMedicoWhereInput[]
    OR?: HorarioMedicoWhereInput[]
    NOT?: HorarioMedicoWhereInput | HorarioMedicoWhereInput[]
    id?: StringFilter<"HorarioMedico"> | string
    medicoId?: StringFilter<"HorarioMedico"> | string
    diaSemana?: IntFilter<"HorarioMedico"> | number
    horaInicio?: StringFilter<"HorarioMedico"> | string
    horaFin?: StringFilter<"HorarioMedico"> | string
    duracionSlot?: IntFilter<"HorarioMedico"> | number
    createdAt?: DateTimeFilter<"HorarioMedico"> | Date | string
    medico?: XOR<MedicoRelationFilter, MedicoWhereInput>
  }

  export type HorarioMedicoOrderByWithRelationInput = {
    id?: SortOrder
    medicoId?: SortOrder
    diaSemana?: SortOrder
    horaInicio?: SortOrder
    horaFin?: SortOrder
    duracionSlot?: SortOrder
    createdAt?: SortOrder
    medico?: MedicoOrderByWithRelationInput
  }

  export type HorarioMedicoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    medicoId_diaSemana_horaInicio?: HorarioMedicoMedicoIdDiaSemanaHoraInicioCompoundUniqueInput
    AND?: HorarioMedicoWhereInput | HorarioMedicoWhereInput[]
    OR?: HorarioMedicoWhereInput[]
    NOT?: HorarioMedicoWhereInput | HorarioMedicoWhereInput[]
    medicoId?: StringFilter<"HorarioMedico"> | string
    diaSemana?: IntFilter<"HorarioMedico"> | number
    horaInicio?: StringFilter<"HorarioMedico"> | string
    horaFin?: StringFilter<"HorarioMedico"> | string
    duracionSlot?: IntFilter<"HorarioMedico"> | number
    createdAt?: DateTimeFilter<"HorarioMedico"> | Date | string
    medico?: XOR<MedicoRelationFilter, MedicoWhereInput>
  }, "id" | "medicoId_diaSemana_horaInicio">

  export type HorarioMedicoOrderByWithAggregationInput = {
    id?: SortOrder
    medicoId?: SortOrder
    diaSemana?: SortOrder
    horaInicio?: SortOrder
    horaFin?: SortOrder
    duracionSlot?: SortOrder
    createdAt?: SortOrder
    _count?: HorarioMedicoCountOrderByAggregateInput
    _avg?: HorarioMedicoAvgOrderByAggregateInput
    _max?: HorarioMedicoMaxOrderByAggregateInput
    _min?: HorarioMedicoMinOrderByAggregateInput
    _sum?: HorarioMedicoSumOrderByAggregateInput
  }

  export type HorarioMedicoScalarWhereWithAggregatesInput = {
    AND?: HorarioMedicoScalarWhereWithAggregatesInput | HorarioMedicoScalarWhereWithAggregatesInput[]
    OR?: HorarioMedicoScalarWhereWithAggregatesInput[]
    NOT?: HorarioMedicoScalarWhereWithAggregatesInput | HorarioMedicoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"HorarioMedico"> | string
    medicoId?: StringWithAggregatesFilter<"HorarioMedico"> | string
    diaSemana?: IntWithAggregatesFilter<"HorarioMedico"> | number
    horaInicio?: StringWithAggregatesFilter<"HorarioMedico"> | string
    horaFin?: StringWithAggregatesFilter<"HorarioMedico"> | string
    duracionSlot?: IntWithAggregatesFilter<"HorarioMedico"> | number
    createdAt?: DateTimeWithAggregatesFilter<"HorarioMedico"> | Date | string
  }

  export type CitaWhereInput = {
    AND?: CitaWhereInput | CitaWhereInput[]
    OR?: CitaWhereInput[]
    NOT?: CitaWhereInput | CitaWhereInput[]
    id?: StringFilter<"Cita"> | string
    pacienteId?: StringFilter<"Cita"> | string
    medicoId?: StringFilter<"Cita"> | string
    fechaHora?: DateTimeFilter<"Cita"> | Date | string
    estado?: EnumEstadoCitaFilter<"Cita"> | $Enums.EstadoCita
    tipoReserva?: EnumTipoReservaFilter<"Cita"> | $Enums.TipoReserva
    motivo?: StringNullableFilter<"Cita"> | string | null
    createdAt?: DateTimeFilter<"Cita"> | Date | string
    updatedAt?: DateTimeFilter<"Cita"> | Date | string
    medico?: XOR<MedicoRelationFilter, MedicoWhereInput>
  }

  export type CitaOrderByWithRelationInput = {
    id?: SortOrder
    pacienteId?: SortOrder
    medicoId?: SortOrder
    fechaHora?: SortOrder
    estado?: SortOrder
    tipoReserva?: SortOrder
    motivo?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    medico?: MedicoOrderByWithRelationInput
  }

  export type CitaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CitaWhereInput | CitaWhereInput[]
    OR?: CitaWhereInput[]
    NOT?: CitaWhereInput | CitaWhereInput[]
    pacienteId?: StringFilter<"Cita"> | string
    medicoId?: StringFilter<"Cita"> | string
    fechaHora?: DateTimeFilter<"Cita"> | Date | string
    estado?: EnumEstadoCitaFilter<"Cita"> | $Enums.EstadoCita
    tipoReserva?: EnumTipoReservaFilter<"Cita"> | $Enums.TipoReserva
    motivo?: StringNullableFilter<"Cita"> | string | null
    createdAt?: DateTimeFilter<"Cita"> | Date | string
    updatedAt?: DateTimeFilter<"Cita"> | Date | string
    medico?: XOR<MedicoRelationFilter, MedicoWhereInput>
  }, "id">

  export type CitaOrderByWithAggregationInput = {
    id?: SortOrder
    pacienteId?: SortOrder
    medicoId?: SortOrder
    fechaHora?: SortOrder
    estado?: SortOrder
    tipoReserva?: SortOrder
    motivo?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CitaCountOrderByAggregateInput
    _max?: CitaMaxOrderByAggregateInput
    _min?: CitaMinOrderByAggregateInput
  }

  export type CitaScalarWhereWithAggregatesInput = {
    AND?: CitaScalarWhereWithAggregatesInput | CitaScalarWhereWithAggregatesInput[]
    OR?: CitaScalarWhereWithAggregatesInput[]
    NOT?: CitaScalarWhereWithAggregatesInput | CitaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Cita"> | string
    pacienteId?: StringWithAggregatesFilter<"Cita"> | string
    medicoId?: StringWithAggregatesFilter<"Cita"> | string
    fechaHora?: DateTimeWithAggregatesFilter<"Cita"> | Date | string
    estado?: EnumEstadoCitaWithAggregatesFilter<"Cita"> | $Enums.EstadoCita
    tipoReserva?: EnumTipoReservaWithAggregatesFilter<"Cita"> | $Enums.TipoReserva
    motivo?: StringNullableWithAggregatesFilter<"Cita"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Cita"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Cita"> | Date | string
  }

  export type EspecialidadCreateInput = {
    id?: string
    nombre: string
    createdAt?: Date | string
    medicos?: MedicoCreateNestedManyWithoutEspecialidadInput
  }

  export type EspecialidadUncheckedCreateInput = {
    id?: string
    nombre: string
    createdAt?: Date | string
    medicos?: MedicoUncheckedCreateNestedManyWithoutEspecialidadInput
  }

  export type EspecialidadUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    medicos?: MedicoUpdateManyWithoutEspecialidadNestedInput
  }

  export type EspecialidadUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    medicos?: MedicoUncheckedUpdateManyWithoutEspecialidadNestedInput
  }

  export type EspecialidadCreateManyInput = {
    id?: string
    nombre: string
    createdAt?: Date | string
  }

  export type EspecialidadUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EspecialidadUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MedicoCreateInput = {
    id?: string
    usuarioId: string
    nombreUsuario: string
    turno: $Enums.Turno
    activo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    especialidad: EspecialidadCreateNestedOneWithoutMedicosInput
    horarios?: HorarioMedicoCreateNestedManyWithoutMedicoInput
    citas?: CitaCreateNestedManyWithoutMedicoInput
  }

  export type MedicoUncheckedCreateInput = {
    id?: string
    usuarioId: string
    nombreUsuario: string
    especialidadId: string
    turno: $Enums.Turno
    activo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    horarios?: HorarioMedicoUncheckedCreateNestedManyWithoutMedicoInput
    citas?: CitaUncheckedCreateNestedManyWithoutMedicoInput
  }

  export type MedicoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    nombreUsuario?: StringFieldUpdateOperationsInput | string
    turno?: EnumTurnoFieldUpdateOperationsInput | $Enums.Turno
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    especialidad?: EspecialidadUpdateOneRequiredWithoutMedicosNestedInput
    horarios?: HorarioMedicoUpdateManyWithoutMedicoNestedInput
    citas?: CitaUpdateManyWithoutMedicoNestedInput
  }

  export type MedicoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    nombreUsuario?: StringFieldUpdateOperationsInput | string
    especialidadId?: StringFieldUpdateOperationsInput | string
    turno?: EnumTurnoFieldUpdateOperationsInput | $Enums.Turno
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    horarios?: HorarioMedicoUncheckedUpdateManyWithoutMedicoNestedInput
    citas?: CitaUncheckedUpdateManyWithoutMedicoNestedInput
  }

  export type MedicoCreateManyInput = {
    id?: string
    usuarioId: string
    nombreUsuario: string
    especialidadId: string
    turno: $Enums.Turno
    activo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MedicoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    nombreUsuario?: StringFieldUpdateOperationsInput | string
    turno?: EnumTurnoFieldUpdateOperationsInput | $Enums.Turno
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MedicoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    nombreUsuario?: StringFieldUpdateOperationsInput | string
    especialidadId?: StringFieldUpdateOperationsInput | string
    turno?: EnumTurnoFieldUpdateOperationsInput | $Enums.Turno
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HorarioMedicoCreateInput = {
    id?: string
    diaSemana: number
    horaInicio: string
    horaFin: string
    duracionSlot?: number
    createdAt?: Date | string
    medico: MedicoCreateNestedOneWithoutHorariosInput
  }

  export type HorarioMedicoUncheckedCreateInput = {
    id?: string
    medicoId: string
    diaSemana: number
    horaInicio: string
    horaFin: string
    duracionSlot?: number
    createdAt?: Date | string
  }

  export type HorarioMedicoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    diaSemana?: IntFieldUpdateOperationsInput | number
    horaInicio?: StringFieldUpdateOperationsInput | string
    horaFin?: StringFieldUpdateOperationsInput | string
    duracionSlot?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    medico?: MedicoUpdateOneRequiredWithoutHorariosNestedInput
  }

  export type HorarioMedicoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    medicoId?: StringFieldUpdateOperationsInput | string
    diaSemana?: IntFieldUpdateOperationsInput | number
    horaInicio?: StringFieldUpdateOperationsInput | string
    horaFin?: StringFieldUpdateOperationsInput | string
    duracionSlot?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HorarioMedicoCreateManyInput = {
    id?: string
    medicoId: string
    diaSemana: number
    horaInicio: string
    horaFin: string
    duracionSlot?: number
    createdAt?: Date | string
  }

  export type HorarioMedicoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    diaSemana?: IntFieldUpdateOperationsInput | number
    horaInicio?: StringFieldUpdateOperationsInput | string
    horaFin?: StringFieldUpdateOperationsInput | string
    duracionSlot?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HorarioMedicoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    medicoId?: StringFieldUpdateOperationsInput | string
    diaSemana?: IntFieldUpdateOperationsInput | number
    horaInicio?: StringFieldUpdateOperationsInput | string
    horaFin?: StringFieldUpdateOperationsInput | string
    duracionSlot?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CitaCreateInput = {
    id?: string
    pacienteId: string
    fechaHora: Date | string
    estado?: $Enums.EstadoCita
    tipoReserva?: $Enums.TipoReserva
    motivo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    medico: MedicoCreateNestedOneWithoutCitasInput
  }

  export type CitaUncheckedCreateInput = {
    id?: string
    pacienteId: string
    medicoId: string
    fechaHora: Date | string
    estado?: $Enums.EstadoCita
    tipoReserva?: $Enums.TipoReserva
    motivo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CitaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pacienteId?: StringFieldUpdateOperationsInput | string
    fechaHora?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: EnumEstadoCitaFieldUpdateOperationsInput | $Enums.EstadoCita
    tipoReserva?: EnumTipoReservaFieldUpdateOperationsInput | $Enums.TipoReserva
    motivo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    medico?: MedicoUpdateOneRequiredWithoutCitasNestedInput
  }

  export type CitaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pacienteId?: StringFieldUpdateOperationsInput | string
    medicoId?: StringFieldUpdateOperationsInput | string
    fechaHora?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: EnumEstadoCitaFieldUpdateOperationsInput | $Enums.EstadoCita
    tipoReserva?: EnumTipoReservaFieldUpdateOperationsInput | $Enums.TipoReserva
    motivo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CitaCreateManyInput = {
    id?: string
    pacienteId: string
    medicoId: string
    fechaHora: Date | string
    estado?: $Enums.EstadoCita
    tipoReserva?: $Enums.TipoReserva
    motivo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CitaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    pacienteId?: StringFieldUpdateOperationsInput | string
    fechaHora?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: EnumEstadoCitaFieldUpdateOperationsInput | $Enums.EstadoCita
    tipoReserva?: EnumTipoReservaFieldUpdateOperationsInput | $Enums.TipoReserva
    motivo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CitaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    pacienteId?: StringFieldUpdateOperationsInput | string
    medicoId?: StringFieldUpdateOperationsInput | string
    fechaHora?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: EnumEstadoCitaFieldUpdateOperationsInput | $Enums.EstadoCita
    tipoReserva?: EnumTipoReservaFieldUpdateOperationsInput | $Enums.TipoReserva
    motivo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type MedicoListRelationFilter = {
    every?: MedicoWhereInput
    some?: MedicoWhereInput
    none?: MedicoWhereInput
  }

  export type MedicoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EspecialidadCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    createdAt?: SortOrder
  }

  export type EspecialidadMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    createdAt?: SortOrder
  }

  export type EspecialidadMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumTurnoFilter<$PrismaModel = never> = {
    equals?: $Enums.Turno | EnumTurnoFieldRefInput<$PrismaModel>
    in?: $Enums.Turno[] | ListEnumTurnoFieldRefInput<$PrismaModel>
    notIn?: $Enums.Turno[] | ListEnumTurnoFieldRefInput<$PrismaModel>
    not?: NestedEnumTurnoFilter<$PrismaModel> | $Enums.Turno
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EspecialidadRelationFilter = {
    is?: EspecialidadWhereInput
    isNot?: EspecialidadWhereInput
  }

  export type HorarioMedicoListRelationFilter = {
    every?: HorarioMedicoWhereInput
    some?: HorarioMedicoWhereInput
    none?: HorarioMedicoWhereInput
  }

  export type CitaListRelationFilter = {
    every?: CitaWhereInput
    some?: CitaWhereInput
    none?: CitaWhereInput
  }

  export type HorarioMedicoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CitaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MedicoCountOrderByAggregateInput = {
    id?: SortOrder
    usuarioId?: SortOrder
    nombreUsuario?: SortOrder
    especialidadId?: SortOrder
    turno?: SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MedicoMaxOrderByAggregateInput = {
    id?: SortOrder
    usuarioId?: SortOrder
    nombreUsuario?: SortOrder
    especialidadId?: SortOrder
    turno?: SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MedicoMinOrderByAggregateInput = {
    id?: SortOrder
    usuarioId?: SortOrder
    nombreUsuario?: SortOrder
    especialidadId?: SortOrder
    turno?: SortOrder
    activo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTurnoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Turno | EnumTurnoFieldRefInput<$PrismaModel>
    in?: $Enums.Turno[] | ListEnumTurnoFieldRefInput<$PrismaModel>
    notIn?: $Enums.Turno[] | ListEnumTurnoFieldRefInput<$PrismaModel>
    not?: NestedEnumTurnoWithAggregatesFilter<$PrismaModel> | $Enums.Turno
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTurnoFilter<$PrismaModel>
    _max?: NestedEnumTurnoFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type MedicoRelationFilter = {
    is?: MedicoWhereInput
    isNot?: MedicoWhereInput
  }

  export type HorarioMedicoMedicoIdDiaSemanaHoraInicioCompoundUniqueInput = {
    medicoId: string
    diaSemana: number
    horaInicio: string
  }

  export type HorarioMedicoCountOrderByAggregateInput = {
    id?: SortOrder
    medicoId?: SortOrder
    diaSemana?: SortOrder
    horaInicio?: SortOrder
    horaFin?: SortOrder
    duracionSlot?: SortOrder
    createdAt?: SortOrder
  }

  export type HorarioMedicoAvgOrderByAggregateInput = {
    diaSemana?: SortOrder
    duracionSlot?: SortOrder
  }

  export type HorarioMedicoMaxOrderByAggregateInput = {
    id?: SortOrder
    medicoId?: SortOrder
    diaSemana?: SortOrder
    horaInicio?: SortOrder
    horaFin?: SortOrder
    duracionSlot?: SortOrder
    createdAt?: SortOrder
  }

  export type HorarioMedicoMinOrderByAggregateInput = {
    id?: SortOrder
    medicoId?: SortOrder
    diaSemana?: SortOrder
    horaInicio?: SortOrder
    horaFin?: SortOrder
    duracionSlot?: SortOrder
    createdAt?: SortOrder
  }

  export type HorarioMedicoSumOrderByAggregateInput = {
    diaSemana?: SortOrder
    duracionSlot?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumEstadoCitaFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoCita | EnumEstadoCitaFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoCita[] | ListEnumEstadoCitaFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoCita[] | ListEnumEstadoCitaFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoCitaFilter<$PrismaModel> | $Enums.EstadoCita
  }

  export type EnumTipoReservaFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoReserva | EnumTipoReservaFieldRefInput<$PrismaModel>
    in?: $Enums.TipoReserva[] | ListEnumTipoReservaFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoReserva[] | ListEnumTipoReservaFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoReservaFilter<$PrismaModel> | $Enums.TipoReserva
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CitaCountOrderByAggregateInput = {
    id?: SortOrder
    pacienteId?: SortOrder
    medicoId?: SortOrder
    fechaHora?: SortOrder
    estado?: SortOrder
    tipoReserva?: SortOrder
    motivo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CitaMaxOrderByAggregateInput = {
    id?: SortOrder
    pacienteId?: SortOrder
    medicoId?: SortOrder
    fechaHora?: SortOrder
    estado?: SortOrder
    tipoReserva?: SortOrder
    motivo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CitaMinOrderByAggregateInput = {
    id?: SortOrder
    pacienteId?: SortOrder
    medicoId?: SortOrder
    fechaHora?: SortOrder
    estado?: SortOrder
    tipoReserva?: SortOrder
    motivo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumEstadoCitaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoCita | EnumEstadoCitaFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoCita[] | ListEnumEstadoCitaFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoCita[] | ListEnumEstadoCitaFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoCitaWithAggregatesFilter<$PrismaModel> | $Enums.EstadoCita
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEstadoCitaFilter<$PrismaModel>
    _max?: NestedEnumEstadoCitaFilter<$PrismaModel>
  }

  export type EnumTipoReservaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoReserva | EnumTipoReservaFieldRefInput<$PrismaModel>
    in?: $Enums.TipoReserva[] | ListEnumTipoReservaFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoReserva[] | ListEnumTipoReservaFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoReservaWithAggregatesFilter<$PrismaModel> | $Enums.TipoReserva
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoReservaFilter<$PrismaModel>
    _max?: NestedEnumTipoReservaFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type MedicoCreateNestedManyWithoutEspecialidadInput = {
    create?: XOR<MedicoCreateWithoutEspecialidadInput, MedicoUncheckedCreateWithoutEspecialidadInput> | MedicoCreateWithoutEspecialidadInput[] | MedicoUncheckedCreateWithoutEspecialidadInput[]
    connectOrCreate?: MedicoCreateOrConnectWithoutEspecialidadInput | MedicoCreateOrConnectWithoutEspecialidadInput[]
    createMany?: MedicoCreateManyEspecialidadInputEnvelope
    connect?: MedicoWhereUniqueInput | MedicoWhereUniqueInput[]
  }

  export type MedicoUncheckedCreateNestedManyWithoutEspecialidadInput = {
    create?: XOR<MedicoCreateWithoutEspecialidadInput, MedicoUncheckedCreateWithoutEspecialidadInput> | MedicoCreateWithoutEspecialidadInput[] | MedicoUncheckedCreateWithoutEspecialidadInput[]
    connectOrCreate?: MedicoCreateOrConnectWithoutEspecialidadInput | MedicoCreateOrConnectWithoutEspecialidadInput[]
    createMany?: MedicoCreateManyEspecialidadInputEnvelope
    connect?: MedicoWhereUniqueInput | MedicoWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type MedicoUpdateManyWithoutEspecialidadNestedInput = {
    create?: XOR<MedicoCreateWithoutEspecialidadInput, MedicoUncheckedCreateWithoutEspecialidadInput> | MedicoCreateWithoutEspecialidadInput[] | MedicoUncheckedCreateWithoutEspecialidadInput[]
    connectOrCreate?: MedicoCreateOrConnectWithoutEspecialidadInput | MedicoCreateOrConnectWithoutEspecialidadInput[]
    upsert?: MedicoUpsertWithWhereUniqueWithoutEspecialidadInput | MedicoUpsertWithWhereUniqueWithoutEspecialidadInput[]
    createMany?: MedicoCreateManyEspecialidadInputEnvelope
    set?: MedicoWhereUniqueInput | MedicoWhereUniqueInput[]
    disconnect?: MedicoWhereUniqueInput | MedicoWhereUniqueInput[]
    delete?: MedicoWhereUniqueInput | MedicoWhereUniqueInput[]
    connect?: MedicoWhereUniqueInput | MedicoWhereUniqueInput[]
    update?: MedicoUpdateWithWhereUniqueWithoutEspecialidadInput | MedicoUpdateWithWhereUniqueWithoutEspecialidadInput[]
    updateMany?: MedicoUpdateManyWithWhereWithoutEspecialidadInput | MedicoUpdateManyWithWhereWithoutEspecialidadInput[]
    deleteMany?: MedicoScalarWhereInput | MedicoScalarWhereInput[]
  }

  export type MedicoUncheckedUpdateManyWithoutEspecialidadNestedInput = {
    create?: XOR<MedicoCreateWithoutEspecialidadInput, MedicoUncheckedCreateWithoutEspecialidadInput> | MedicoCreateWithoutEspecialidadInput[] | MedicoUncheckedCreateWithoutEspecialidadInput[]
    connectOrCreate?: MedicoCreateOrConnectWithoutEspecialidadInput | MedicoCreateOrConnectWithoutEspecialidadInput[]
    upsert?: MedicoUpsertWithWhereUniqueWithoutEspecialidadInput | MedicoUpsertWithWhereUniqueWithoutEspecialidadInput[]
    createMany?: MedicoCreateManyEspecialidadInputEnvelope
    set?: MedicoWhereUniqueInput | MedicoWhereUniqueInput[]
    disconnect?: MedicoWhereUniqueInput | MedicoWhereUniqueInput[]
    delete?: MedicoWhereUniqueInput | MedicoWhereUniqueInput[]
    connect?: MedicoWhereUniqueInput | MedicoWhereUniqueInput[]
    update?: MedicoUpdateWithWhereUniqueWithoutEspecialidadInput | MedicoUpdateWithWhereUniqueWithoutEspecialidadInput[]
    updateMany?: MedicoUpdateManyWithWhereWithoutEspecialidadInput | MedicoUpdateManyWithWhereWithoutEspecialidadInput[]
    deleteMany?: MedicoScalarWhereInput | MedicoScalarWhereInput[]
  }

  export type EspecialidadCreateNestedOneWithoutMedicosInput = {
    create?: XOR<EspecialidadCreateWithoutMedicosInput, EspecialidadUncheckedCreateWithoutMedicosInput>
    connectOrCreate?: EspecialidadCreateOrConnectWithoutMedicosInput
    connect?: EspecialidadWhereUniqueInput
  }

  export type HorarioMedicoCreateNestedManyWithoutMedicoInput = {
    create?: XOR<HorarioMedicoCreateWithoutMedicoInput, HorarioMedicoUncheckedCreateWithoutMedicoInput> | HorarioMedicoCreateWithoutMedicoInput[] | HorarioMedicoUncheckedCreateWithoutMedicoInput[]
    connectOrCreate?: HorarioMedicoCreateOrConnectWithoutMedicoInput | HorarioMedicoCreateOrConnectWithoutMedicoInput[]
    createMany?: HorarioMedicoCreateManyMedicoInputEnvelope
    connect?: HorarioMedicoWhereUniqueInput | HorarioMedicoWhereUniqueInput[]
  }

  export type CitaCreateNestedManyWithoutMedicoInput = {
    create?: XOR<CitaCreateWithoutMedicoInput, CitaUncheckedCreateWithoutMedicoInput> | CitaCreateWithoutMedicoInput[] | CitaUncheckedCreateWithoutMedicoInput[]
    connectOrCreate?: CitaCreateOrConnectWithoutMedicoInput | CitaCreateOrConnectWithoutMedicoInput[]
    createMany?: CitaCreateManyMedicoInputEnvelope
    connect?: CitaWhereUniqueInput | CitaWhereUniqueInput[]
  }

  export type HorarioMedicoUncheckedCreateNestedManyWithoutMedicoInput = {
    create?: XOR<HorarioMedicoCreateWithoutMedicoInput, HorarioMedicoUncheckedCreateWithoutMedicoInput> | HorarioMedicoCreateWithoutMedicoInput[] | HorarioMedicoUncheckedCreateWithoutMedicoInput[]
    connectOrCreate?: HorarioMedicoCreateOrConnectWithoutMedicoInput | HorarioMedicoCreateOrConnectWithoutMedicoInput[]
    createMany?: HorarioMedicoCreateManyMedicoInputEnvelope
    connect?: HorarioMedicoWhereUniqueInput | HorarioMedicoWhereUniqueInput[]
  }

  export type CitaUncheckedCreateNestedManyWithoutMedicoInput = {
    create?: XOR<CitaCreateWithoutMedicoInput, CitaUncheckedCreateWithoutMedicoInput> | CitaCreateWithoutMedicoInput[] | CitaUncheckedCreateWithoutMedicoInput[]
    connectOrCreate?: CitaCreateOrConnectWithoutMedicoInput | CitaCreateOrConnectWithoutMedicoInput[]
    createMany?: CitaCreateManyMedicoInputEnvelope
    connect?: CitaWhereUniqueInput | CitaWhereUniqueInput[]
  }

  export type EnumTurnoFieldUpdateOperationsInput = {
    set?: $Enums.Turno
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EspecialidadUpdateOneRequiredWithoutMedicosNestedInput = {
    create?: XOR<EspecialidadCreateWithoutMedicosInput, EspecialidadUncheckedCreateWithoutMedicosInput>
    connectOrCreate?: EspecialidadCreateOrConnectWithoutMedicosInput
    upsert?: EspecialidadUpsertWithoutMedicosInput
    connect?: EspecialidadWhereUniqueInput
    update?: XOR<XOR<EspecialidadUpdateToOneWithWhereWithoutMedicosInput, EspecialidadUpdateWithoutMedicosInput>, EspecialidadUncheckedUpdateWithoutMedicosInput>
  }

  export type HorarioMedicoUpdateManyWithoutMedicoNestedInput = {
    create?: XOR<HorarioMedicoCreateWithoutMedicoInput, HorarioMedicoUncheckedCreateWithoutMedicoInput> | HorarioMedicoCreateWithoutMedicoInput[] | HorarioMedicoUncheckedCreateWithoutMedicoInput[]
    connectOrCreate?: HorarioMedicoCreateOrConnectWithoutMedicoInput | HorarioMedicoCreateOrConnectWithoutMedicoInput[]
    upsert?: HorarioMedicoUpsertWithWhereUniqueWithoutMedicoInput | HorarioMedicoUpsertWithWhereUniqueWithoutMedicoInput[]
    createMany?: HorarioMedicoCreateManyMedicoInputEnvelope
    set?: HorarioMedicoWhereUniqueInput | HorarioMedicoWhereUniqueInput[]
    disconnect?: HorarioMedicoWhereUniqueInput | HorarioMedicoWhereUniqueInput[]
    delete?: HorarioMedicoWhereUniqueInput | HorarioMedicoWhereUniqueInput[]
    connect?: HorarioMedicoWhereUniqueInput | HorarioMedicoWhereUniqueInput[]
    update?: HorarioMedicoUpdateWithWhereUniqueWithoutMedicoInput | HorarioMedicoUpdateWithWhereUniqueWithoutMedicoInput[]
    updateMany?: HorarioMedicoUpdateManyWithWhereWithoutMedicoInput | HorarioMedicoUpdateManyWithWhereWithoutMedicoInput[]
    deleteMany?: HorarioMedicoScalarWhereInput | HorarioMedicoScalarWhereInput[]
  }

  export type CitaUpdateManyWithoutMedicoNestedInput = {
    create?: XOR<CitaCreateWithoutMedicoInput, CitaUncheckedCreateWithoutMedicoInput> | CitaCreateWithoutMedicoInput[] | CitaUncheckedCreateWithoutMedicoInput[]
    connectOrCreate?: CitaCreateOrConnectWithoutMedicoInput | CitaCreateOrConnectWithoutMedicoInput[]
    upsert?: CitaUpsertWithWhereUniqueWithoutMedicoInput | CitaUpsertWithWhereUniqueWithoutMedicoInput[]
    createMany?: CitaCreateManyMedicoInputEnvelope
    set?: CitaWhereUniqueInput | CitaWhereUniqueInput[]
    disconnect?: CitaWhereUniqueInput | CitaWhereUniqueInput[]
    delete?: CitaWhereUniqueInput | CitaWhereUniqueInput[]
    connect?: CitaWhereUniqueInput | CitaWhereUniqueInput[]
    update?: CitaUpdateWithWhereUniqueWithoutMedicoInput | CitaUpdateWithWhereUniqueWithoutMedicoInput[]
    updateMany?: CitaUpdateManyWithWhereWithoutMedicoInput | CitaUpdateManyWithWhereWithoutMedicoInput[]
    deleteMany?: CitaScalarWhereInput | CitaScalarWhereInput[]
  }

  export type HorarioMedicoUncheckedUpdateManyWithoutMedicoNestedInput = {
    create?: XOR<HorarioMedicoCreateWithoutMedicoInput, HorarioMedicoUncheckedCreateWithoutMedicoInput> | HorarioMedicoCreateWithoutMedicoInput[] | HorarioMedicoUncheckedCreateWithoutMedicoInput[]
    connectOrCreate?: HorarioMedicoCreateOrConnectWithoutMedicoInput | HorarioMedicoCreateOrConnectWithoutMedicoInput[]
    upsert?: HorarioMedicoUpsertWithWhereUniqueWithoutMedicoInput | HorarioMedicoUpsertWithWhereUniqueWithoutMedicoInput[]
    createMany?: HorarioMedicoCreateManyMedicoInputEnvelope
    set?: HorarioMedicoWhereUniqueInput | HorarioMedicoWhereUniqueInput[]
    disconnect?: HorarioMedicoWhereUniqueInput | HorarioMedicoWhereUniqueInput[]
    delete?: HorarioMedicoWhereUniqueInput | HorarioMedicoWhereUniqueInput[]
    connect?: HorarioMedicoWhereUniqueInput | HorarioMedicoWhereUniqueInput[]
    update?: HorarioMedicoUpdateWithWhereUniqueWithoutMedicoInput | HorarioMedicoUpdateWithWhereUniqueWithoutMedicoInput[]
    updateMany?: HorarioMedicoUpdateManyWithWhereWithoutMedicoInput | HorarioMedicoUpdateManyWithWhereWithoutMedicoInput[]
    deleteMany?: HorarioMedicoScalarWhereInput | HorarioMedicoScalarWhereInput[]
  }

  export type CitaUncheckedUpdateManyWithoutMedicoNestedInput = {
    create?: XOR<CitaCreateWithoutMedicoInput, CitaUncheckedCreateWithoutMedicoInput> | CitaCreateWithoutMedicoInput[] | CitaUncheckedCreateWithoutMedicoInput[]
    connectOrCreate?: CitaCreateOrConnectWithoutMedicoInput | CitaCreateOrConnectWithoutMedicoInput[]
    upsert?: CitaUpsertWithWhereUniqueWithoutMedicoInput | CitaUpsertWithWhereUniqueWithoutMedicoInput[]
    createMany?: CitaCreateManyMedicoInputEnvelope
    set?: CitaWhereUniqueInput | CitaWhereUniqueInput[]
    disconnect?: CitaWhereUniqueInput | CitaWhereUniqueInput[]
    delete?: CitaWhereUniqueInput | CitaWhereUniqueInput[]
    connect?: CitaWhereUniqueInput | CitaWhereUniqueInput[]
    update?: CitaUpdateWithWhereUniqueWithoutMedicoInput | CitaUpdateWithWhereUniqueWithoutMedicoInput[]
    updateMany?: CitaUpdateManyWithWhereWithoutMedicoInput | CitaUpdateManyWithWhereWithoutMedicoInput[]
    deleteMany?: CitaScalarWhereInput | CitaScalarWhereInput[]
  }

  export type MedicoCreateNestedOneWithoutHorariosInput = {
    create?: XOR<MedicoCreateWithoutHorariosInput, MedicoUncheckedCreateWithoutHorariosInput>
    connectOrCreate?: MedicoCreateOrConnectWithoutHorariosInput
    connect?: MedicoWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type MedicoUpdateOneRequiredWithoutHorariosNestedInput = {
    create?: XOR<MedicoCreateWithoutHorariosInput, MedicoUncheckedCreateWithoutHorariosInput>
    connectOrCreate?: MedicoCreateOrConnectWithoutHorariosInput
    upsert?: MedicoUpsertWithoutHorariosInput
    connect?: MedicoWhereUniqueInput
    update?: XOR<XOR<MedicoUpdateToOneWithWhereWithoutHorariosInput, MedicoUpdateWithoutHorariosInput>, MedicoUncheckedUpdateWithoutHorariosInput>
  }

  export type MedicoCreateNestedOneWithoutCitasInput = {
    create?: XOR<MedicoCreateWithoutCitasInput, MedicoUncheckedCreateWithoutCitasInput>
    connectOrCreate?: MedicoCreateOrConnectWithoutCitasInput
    connect?: MedicoWhereUniqueInput
  }

  export type EnumEstadoCitaFieldUpdateOperationsInput = {
    set?: $Enums.EstadoCita
  }

  export type EnumTipoReservaFieldUpdateOperationsInput = {
    set?: $Enums.TipoReserva
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type MedicoUpdateOneRequiredWithoutCitasNestedInput = {
    create?: XOR<MedicoCreateWithoutCitasInput, MedicoUncheckedCreateWithoutCitasInput>
    connectOrCreate?: MedicoCreateOrConnectWithoutCitasInput
    upsert?: MedicoUpsertWithoutCitasInput
    connect?: MedicoWhereUniqueInput
    update?: XOR<XOR<MedicoUpdateToOneWithWhereWithoutCitasInput, MedicoUpdateWithoutCitasInput>, MedicoUncheckedUpdateWithoutCitasInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumTurnoFilter<$PrismaModel = never> = {
    equals?: $Enums.Turno | EnumTurnoFieldRefInput<$PrismaModel>
    in?: $Enums.Turno[] | ListEnumTurnoFieldRefInput<$PrismaModel>
    notIn?: $Enums.Turno[] | ListEnumTurnoFieldRefInput<$PrismaModel>
    not?: NestedEnumTurnoFilter<$PrismaModel> | $Enums.Turno
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumTurnoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Turno | EnumTurnoFieldRefInput<$PrismaModel>
    in?: $Enums.Turno[] | ListEnumTurnoFieldRefInput<$PrismaModel>
    notIn?: $Enums.Turno[] | ListEnumTurnoFieldRefInput<$PrismaModel>
    not?: NestedEnumTurnoWithAggregatesFilter<$PrismaModel> | $Enums.Turno
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTurnoFilter<$PrismaModel>
    _max?: NestedEnumTurnoFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumEstadoCitaFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoCita | EnumEstadoCitaFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoCita[] | ListEnumEstadoCitaFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoCita[] | ListEnumEstadoCitaFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoCitaFilter<$PrismaModel> | $Enums.EstadoCita
  }

  export type NestedEnumTipoReservaFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoReserva | EnumTipoReservaFieldRefInput<$PrismaModel>
    in?: $Enums.TipoReserva[] | ListEnumTipoReservaFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoReserva[] | ListEnumTipoReservaFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoReservaFilter<$PrismaModel> | $Enums.TipoReserva
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumEstadoCitaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoCita | EnumEstadoCitaFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoCita[] | ListEnumEstadoCitaFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoCita[] | ListEnumEstadoCitaFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoCitaWithAggregatesFilter<$PrismaModel> | $Enums.EstadoCita
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEstadoCitaFilter<$PrismaModel>
    _max?: NestedEnumEstadoCitaFilter<$PrismaModel>
  }

  export type NestedEnumTipoReservaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoReserva | EnumTipoReservaFieldRefInput<$PrismaModel>
    in?: $Enums.TipoReserva[] | ListEnumTipoReservaFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoReserva[] | ListEnumTipoReservaFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoReservaWithAggregatesFilter<$PrismaModel> | $Enums.TipoReserva
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoReservaFilter<$PrismaModel>
    _max?: NestedEnumTipoReservaFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type MedicoCreateWithoutEspecialidadInput = {
    id?: string
    usuarioId: string
    nombreUsuario: string
    turno: $Enums.Turno
    activo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    horarios?: HorarioMedicoCreateNestedManyWithoutMedicoInput
    citas?: CitaCreateNestedManyWithoutMedicoInput
  }

  export type MedicoUncheckedCreateWithoutEspecialidadInput = {
    id?: string
    usuarioId: string
    nombreUsuario: string
    turno: $Enums.Turno
    activo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    horarios?: HorarioMedicoUncheckedCreateNestedManyWithoutMedicoInput
    citas?: CitaUncheckedCreateNestedManyWithoutMedicoInput
  }

  export type MedicoCreateOrConnectWithoutEspecialidadInput = {
    where: MedicoWhereUniqueInput
    create: XOR<MedicoCreateWithoutEspecialidadInput, MedicoUncheckedCreateWithoutEspecialidadInput>
  }

  export type MedicoCreateManyEspecialidadInputEnvelope = {
    data: MedicoCreateManyEspecialidadInput | MedicoCreateManyEspecialidadInput[]
    skipDuplicates?: boolean
  }

  export type MedicoUpsertWithWhereUniqueWithoutEspecialidadInput = {
    where: MedicoWhereUniqueInput
    update: XOR<MedicoUpdateWithoutEspecialidadInput, MedicoUncheckedUpdateWithoutEspecialidadInput>
    create: XOR<MedicoCreateWithoutEspecialidadInput, MedicoUncheckedCreateWithoutEspecialidadInput>
  }

  export type MedicoUpdateWithWhereUniqueWithoutEspecialidadInput = {
    where: MedicoWhereUniqueInput
    data: XOR<MedicoUpdateWithoutEspecialidadInput, MedicoUncheckedUpdateWithoutEspecialidadInput>
  }

  export type MedicoUpdateManyWithWhereWithoutEspecialidadInput = {
    where: MedicoScalarWhereInput
    data: XOR<MedicoUpdateManyMutationInput, MedicoUncheckedUpdateManyWithoutEspecialidadInput>
  }

  export type MedicoScalarWhereInput = {
    AND?: MedicoScalarWhereInput | MedicoScalarWhereInput[]
    OR?: MedicoScalarWhereInput[]
    NOT?: MedicoScalarWhereInput | MedicoScalarWhereInput[]
    id?: StringFilter<"Medico"> | string
    usuarioId?: StringFilter<"Medico"> | string
    nombreUsuario?: StringFilter<"Medico"> | string
    especialidadId?: StringFilter<"Medico"> | string
    turno?: EnumTurnoFilter<"Medico"> | $Enums.Turno
    activo?: BoolFilter<"Medico"> | boolean
    createdAt?: DateTimeFilter<"Medico"> | Date | string
    updatedAt?: DateTimeFilter<"Medico"> | Date | string
  }

  export type EspecialidadCreateWithoutMedicosInput = {
    id?: string
    nombre: string
    createdAt?: Date | string
  }

  export type EspecialidadUncheckedCreateWithoutMedicosInput = {
    id?: string
    nombre: string
    createdAt?: Date | string
  }

  export type EspecialidadCreateOrConnectWithoutMedicosInput = {
    where: EspecialidadWhereUniqueInput
    create: XOR<EspecialidadCreateWithoutMedicosInput, EspecialidadUncheckedCreateWithoutMedicosInput>
  }

  export type HorarioMedicoCreateWithoutMedicoInput = {
    id?: string
    diaSemana: number
    horaInicio: string
    horaFin: string
    duracionSlot?: number
    createdAt?: Date | string
  }

  export type HorarioMedicoUncheckedCreateWithoutMedicoInput = {
    id?: string
    diaSemana: number
    horaInicio: string
    horaFin: string
    duracionSlot?: number
    createdAt?: Date | string
  }

  export type HorarioMedicoCreateOrConnectWithoutMedicoInput = {
    where: HorarioMedicoWhereUniqueInput
    create: XOR<HorarioMedicoCreateWithoutMedicoInput, HorarioMedicoUncheckedCreateWithoutMedicoInput>
  }

  export type HorarioMedicoCreateManyMedicoInputEnvelope = {
    data: HorarioMedicoCreateManyMedicoInput | HorarioMedicoCreateManyMedicoInput[]
    skipDuplicates?: boolean
  }

  export type CitaCreateWithoutMedicoInput = {
    id?: string
    pacienteId: string
    fechaHora: Date | string
    estado?: $Enums.EstadoCita
    tipoReserva?: $Enums.TipoReserva
    motivo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CitaUncheckedCreateWithoutMedicoInput = {
    id?: string
    pacienteId: string
    fechaHora: Date | string
    estado?: $Enums.EstadoCita
    tipoReserva?: $Enums.TipoReserva
    motivo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CitaCreateOrConnectWithoutMedicoInput = {
    where: CitaWhereUniqueInput
    create: XOR<CitaCreateWithoutMedicoInput, CitaUncheckedCreateWithoutMedicoInput>
  }

  export type CitaCreateManyMedicoInputEnvelope = {
    data: CitaCreateManyMedicoInput | CitaCreateManyMedicoInput[]
    skipDuplicates?: boolean
  }

  export type EspecialidadUpsertWithoutMedicosInput = {
    update: XOR<EspecialidadUpdateWithoutMedicosInput, EspecialidadUncheckedUpdateWithoutMedicosInput>
    create: XOR<EspecialidadCreateWithoutMedicosInput, EspecialidadUncheckedCreateWithoutMedicosInput>
    where?: EspecialidadWhereInput
  }

  export type EspecialidadUpdateToOneWithWhereWithoutMedicosInput = {
    where?: EspecialidadWhereInput
    data: XOR<EspecialidadUpdateWithoutMedicosInput, EspecialidadUncheckedUpdateWithoutMedicosInput>
  }

  export type EspecialidadUpdateWithoutMedicosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EspecialidadUncheckedUpdateWithoutMedicosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HorarioMedicoUpsertWithWhereUniqueWithoutMedicoInput = {
    where: HorarioMedicoWhereUniqueInput
    update: XOR<HorarioMedicoUpdateWithoutMedicoInput, HorarioMedicoUncheckedUpdateWithoutMedicoInput>
    create: XOR<HorarioMedicoCreateWithoutMedicoInput, HorarioMedicoUncheckedCreateWithoutMedicoInput>
  }

  export type HorarioMedicoUpdateWithWhereUniqueWithoutMedicoInput = {
    where: HorarioMedicoWhereUniqueInput
    data: XOR<HorarioMedicoUpdateWithoutMedicoInput, HorarioMedicoUncheckedUpdateWithoutMedicoInput>
  }

  export type HorarioMedicoUpdateManyWithWhereWithoutMedicoInput = {
    where: HorarioMedicoScalarWhereInput
    data: XOR<HorarioMedicoUpdateManyMutationInput, HorarioMedicoUncheckedUpdateManyWithoutMedicoInput>
  }

  export type HorarioMedicoScalarWhereInput = {
    AND?: HorarioMedicoScalarWhereInput | HorarioMedicoScalarWhereInput[]
    OR?: HorarioMedicoScalarWhereInput[]
    NOT?: HorarioMedicoScalarWhereInput | HorarioMedicoScalarWhereInput[]
    id?: StringFilter<"HorarioMedico"> | string
    medicoId?: StringFilter<"HorarioMedico"> | string
    diaSemana?: IntFilter<"HorarioMedico"> | number
    horaInicio?: StringFilter<"HorarioMedico"> | string
    horaFin?: StringFilter<"HorarioMedico"> | string
    duracionSlot?: IntFilter<"HorarioMedico"> | number
    createdAt?: DateTimeFilter<"HorarioMedico"> | Date | string
  }

  export type CitaUpsertWithWhereUniqueWithoutMedicoInput = {
    where: CitaWhereUniqueInput
    update: XOR<CitaUpdateWithoutMedicoInput, CitaUncheckedUpdateWithoutMedicoInput>
    create: XOR<CitaCreateWithoutMedicoInput, CitaUncheckedCreateWithoutMedicoInput>
  }

  export type CitaUpdateWithWhereUniqueWithoutMedicoInput = {
    where: CitaWhereUniqueInput
    data: XOR<CitaUpdateWithoutMedicoInput, CitaUncheckedUpdateWithoutMedicoInput>
  }

  export type CitaUpdateManyWithWhereWithoutMedicoInput = {
    where: CitaScalarWhereInput
    data: XOR<CitaUpdateManyMutationInput, CitaUncheckedUpdateManyWithoutMedicoInput>
  }

  export type CitaScalarWhereInput = {
    AND?: CitaScalarWhereInput | CitaScalarWhereInput[]
    OR?: CitaScalarWhereInput[]
    NOT?: CitaScalarWhereInput | CitaScalarWhereInput[]
    id?: StringFilter<"Cita"> | string
    pacienteId?: StringFilter<"Cita"> | string
    medicoId?: StringFilter<"Cita"> | string
    fechaHora?: DateTimeFilter<"Cita"> | Date | string
    estado?: EnumEstadoCitaFilter<"Cita"> | $Enums.EstadoCita
    tipoReserva?: EnumTipoReservaFilter<"Cita"> | $Enums.TipoReserva
    motivo?: StringNullableFilter<"Cita"> | string | null
    createdAt?: DateTimeFilter<"Cita"> | Date | string
    updatedAt?: DateTimeFilter<"Cita"> | Date | string
  }

  export type MedicoCreateWithoutHorariosInput = {
    id?: string
    usuarioId: string
    nombreUsuario: string
    turno: $Enums.Turno
    activo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    especialidad: EspecialidadCreateNestedOneWithoutMedicosInput
    citas?: CitaCreateNestedManyWithoutMedicoInput
  }

  export type MedicoUncheckedCreateWithoutHorariosInput = {
    id?: string
    usuarioId: string
    nombreUsuario: string
    especialidadId: string
    turno: $Enums.Turno
    activo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    citas?: CitaUncheckedCreateNestedManyWithoutMedicoInput
  }

  export type MedicoCreateOrConnectWithoutHorariosInput = {
    where: MedicoWhereUniqueInput
    create: XOR<MedicoCreateWithoutHorariosInput, MedicoUncheckedCreateWithoutHorariosInput>
  }

  export type MedicoUpsertWithoutHorariosInput = {
    update: XOR<MedicoUpdateWithoutHorariosInput, MedicoUncheckedUpdateWithoutHorariosInput>
    create: XOR<MedicoCreateWithoutHorariosInput, MedicoUncheckedCreateWithoutHorariosInput>
    where?: MedicoWhereInput
  }

  export type MedicoUpdateToOneWithWhereWithoutHorariosInput = {
    where?: MedicoWhereInput
    data: XOR<MedicoUpdateWithoutHorariosInput, MedicoUncheckedUpdateWithoutHorariosInput>
  }

  export type MedicoUpdateWithoutHorariosInput = {
    id?: StringFieldUpdateOperationsInput | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    nombreUsuario?: StringFieldUpdateOperationsInput | string
    turno?: EnumTurnoFieldUpdateOperationsInput | $Enums.Turno
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    especialidad?: EspecialidadUpdateOneRequiredWithoutMedicosNestedInput
    citas?: CitaUpdateManyWithoutMedicoNestedInput
  }

  export type MedicoUncheckedUpdateWithoutHorariosInput = {
    id?: StringFieldUpdateOperationsInput | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    nombreUsuario?: StringFieldUpdateOperationsInput | string
    especialidadId?: StringFieldUpdateOperationsInput | string
    turno?: EnumTurnoFieldUpdateOperationsInput | $Enums.Turno
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    citas?: CitaUncheckedUpdateManyWithoutMedicoNestedInput
  }

  export type MedicoCreateWithoutCitasInput = {
    id?: string
    usuarioId: string
    nombreUsuario: string
    turno: $Enums.Turno
    activo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    especialidad: EspecialidadCreateNestedOneWithoutMedicosInput
    horarios?: HorarioMedicoCreateNestedManyWithoutMedicoInput
  }

  export type MedicoUncheckedCreateWithoutCitasInput = {
    id?: string
    usuarioId: string
    nombreUsuario: string
    especialidadId: string
    turno: $Enums.Turno
    activo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    horarios?: HorarioMedicoUncheckedCreateNestedManyWithoutMedicoInput
  }

  export type MedicoCreateOrConnectWithoutCitasInput = {
    where: MedicoWhereUniqueInput
    create: XOR<MedicoCreateWithoutCitasInput, MedicoUncheckedCreateWithoutCitasInput>
  }

  export type MedicoUpsertWithoutCitasInput = {
    update: XOR<MedicoUpdateWithoutCitasInput, MedicoUncheckedUpdateWithoutCitasInput>
    create: XOR<MedicoCreateWithoutCitasInput, MedicoUncheckedCreateWithoutCitasInput>
    where?: MedicoWhereInput
  }

  export type MedicoUpdateToOneWithWhereWithoutCitasInput = {
    where?: MedicoWhereInput
    data: XOR<MedicoUpdateWithoutCitasInput, MedicoUncheckedUpdateWithoutCitasInput>
  }

  export type MedicoUpdateWithoutCitasInput = {
    id?: StringFieldUpdateOperationsInput | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    nombreUsuario?: StringFieldUpdateOperationsInput | string
    turno?: EnumTurnoFieldUpdateOperationsInput | $Enums.Turno
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    especialidad?: EspecialidadUpdateOneRequiredWithoutMedicosNestedInput
    horarios?: HorarioMedicoUpdateManyWithoutMedicoNestedInput
  }

  export type MedicoUncheckedUpdateWithoutCitasInput = {
    id?: StringFieldUpdateOperationsInput | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    nombreUsuario?: StringFieldUpdateOperationsInput | string
    especialidadId?: StringFieldUpdateOperationsInput | string
    turno?: EnumTurnoFieldUpdateOperationsInput | $Enums.Turno
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    horarios?: HorarioMedicoUncheckedUpdateManyWithoutMedicoNestedInput
  }

  export type MedicoCreateManyEspecialidadInput = {
    id?: string
    usuarioId: string
    nombreUsuario: string
    turno: $Enums.Turno
    activo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MedicoUpdateWithoutEspecialidadInput = {
    id?: StringFieldUpdateOperationsInput | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    nombreUsuario?: StringFieldUpdateOperationsInput | string
    turno?: EnumTurnoFieldUpdateOperationsInput | $Enums.Turno
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    horarios?: HorarioMedicoUpdateManyWithoutMedicoNestedInput
    citas?: CitaUpdateManyWithoutMedicoNestedInput
  }

  export type MedicoUncheckedUpdateWithoutEspecialidadInput = {
    id?: StringFieldUpdateOperationsInput | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    nombreUsuario?: StringFieldUpdateOperationsInput | string
    turno?: EnumTurnoFieldUpdateOperationsInput | $Enums.Turno
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    horarios?: HorarioMedicoUncheckedUpdateManyWithoutMedicoNestedInput
    citas?: CitaUncheckedUpdateManyWithoutMedicoNestedInput
  }

  export type MedicoUncheckedUpdateManyWithoutEspecialidadInput = {
    id?: StringFieldUpdateOperationsInput | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    nombreUsuario?: StringFieldUpdateOperationsInput | string
    turno?: EnumTurnoFieldUpdateOperationsInput | $Enums.Turno
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HorarioMedicoCreateManyMedicoInput = {
    id?: string
    diaSemana: number
    horaInicio: string
    horaFin: string
    duracionSlot?: number
    createdAt?: Date | string
  }

  export type CitaCreateManyMedicoInput = {
    id?: string
    pacienteId: string
    fechaHora: Date | string
    estado?: $Enums.EstadoCita
    tipoReserva?: $Enums.TipoReserva
    motivo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HorarioMedicoUpdateWithoutMedicoInput = {
    id?: StringFieldUpdateOperationsInput | string
    diaSemana?: IntFieldUpdateOperationsInput | number
    horaInicio?: StringFieldUpdateOperationsInput | string
    horaFin?: StringFieldUpdateOperationsInput | string
    duracionSlot?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HorarioMedicoUncheckedUpdateWithoutMedicoInput = {
    id?: StringFieldUpdateOperationsInput | string
    diaSemana?: IntFieldUpdateOperationsInput | number
    horaInicio?: StringFieldUpdateOperationsInput | string
    horaFin?: StringFieldUpdateOperationsInput | string
    duracionSlot?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HorarioMedicoUncheckedUpdateManyWithoutMedicoInput = {
    id?: StringFieldUpdateOperationsInput | string
    diaSemana?: IntFieldUpdateOperationsInput | number
    horaInicio?: StringFieldUpdateOperationsInput | string
    horaFin?: StringFieldUpdateOperationsInput | string
    duracionSlot?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CitaUpdateWithoutMedicoInput = {
    id?: StringFieldUpdateOperationsInput | string
    pacienteId?: StringFieldUpdateOperationsInput | string
    fechaHora?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: EnumEstadoCitaFieldUpdateOperationsInput | $Enums.EstadoCita
    tipoReserva?: EnumTipoReservaFieldUpdateOperationsInput | $Enums.TipoReserva
    motivo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CitaUncheckedUpdateWithoutMedicoInput = {
    id?: StringFieldUpdateOperationsInput | string
    pacienteId?: StringFieldUpdateOperationsInput | string
    fechaHora?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: EnumEstadoCitaFieldUpdateOperationsInput | $Enums.EstadoCita
    tipoReserva?: EnumTipoReservaFieldUpdateOperationsInput | $Enums.TipoReserva
    motivo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CitaUncheckedUpdateManyWithoutMedicoInput = {
    id?: StringFieldUpdateOperationsInput | string
    pacienteId?: StringFieldUpdateOperationsInput | string
    fechaHora?: DateTimeFieldUpdateOperationsInput | Date | string
    estado?: EnumEstadoCitaFieldUpdateOperationsInput | $Enums.EstadoCita
    tipoReserva?: EnumTipoReservaFieldUpdateOperationsInput | $Enums.TipoReserva
    motivo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use EspecialidadCountOutputTypeDefaultArgs instead
     */
    export type EspecialidadCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EspecialidadCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MedicoCountOutputTypeDefaultArgs instead
     */
    export type MedicoCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MedicoCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EspecialidadDefaultArgs instead
     */
    export type EspecialidadArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EspecialidadDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MedicoDefaultArgs instead
     */
    export type MedicoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MedicoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use HorarioMedicoDefaultArgs instead
     */
    export type HorarioMedicoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = HorarioMedicoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CitaDefaultArgs instead
     */
    export type CitaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CitaDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}