
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
 * Model Consulta
 * 
 */
export type Consulta = $Result.DefaultSelection<Prisma.$ConsultaPayload>
/**
 * Model OrdenAnalisis
 * 
 */
export type OrdenAnalisis = $Result.DefaultSelection<Prisma.$OrdenAnalisisPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Consultas
 * const consultas = await prisma.consulta.findMany()
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
   * // Fetch zero or more Consultas
   * const consultas = await prisma.consulta.findMany()
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
   * `prisma.consulta`: Exposes CRUD operations for the **Consulta** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Consultas
    * const consultas = await prisma.consulta.findMany()
    * ```
    */
  get consulta(): Prisma.ConsultaDelegate<ExtArgs>;

  /**
   * `prisma.ordenAnalisis`: Exposes CRUD operations for the **OrdenAnalisis** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OrdenAnalises
    * const ordenAnalises = await prisma.ordenAnalisis.findMany()
    * ```
    */
  get ordenAnalisis(): Prisma.OrdenAnalisisDelegate<ExtArgs>;
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
    Consulta: 'Consulta',
    OrdenAnalisis: 'OrdenAnalisis'
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
      modelProps: "consulta" | "ordenAnalisis"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Consulta: {
        payload: Prisma.$ConsultaPayload<ExtArgs>
        fields: Prisma.ConsultaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConsultaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConsultaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultaPayload>
          }
          findFirst: {
            args: Prisma.ConsultaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConsultaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultaPayload>
          }
          findMany: {
            args: Prisma.ConsultaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultaPayload>[]
          }
          create: {
            args: Prisma.ConsultaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultaPayload>
          }
          createMany: {
            args: Prisma.ConsultaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConsultaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultaPayload>[]
          }
          delete: {
            args: Prisma.ConsultaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultaPayload>
          }
          update: {
            args: Prisma.ConsultaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultaPayload>
          }
          deleteMany: {
            args: Prisma.ConsultaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConsultaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ConsultaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultaPayload>
          }
          aggregate: {
            args: Prisma.ConsultaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConsulta>
          }
          groupBy: {
            args: Prisma.ConsultaGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConsultaGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConsultaCountArgs<ExtArgs>
            result: $Utils.Optional<ConsultaCountAggregateOutputType> | number
          }
        }
      }
      OrdenAnalisis: {
        payload: Prisma.$OrdenAnalisisPayload<ExtArgs>
        fields: Prisma.OrdenAnalisisFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrdenAnalisisFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenAnalisisPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrdenAnalisisFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenAnalisisPayload>
          }
          findFirst: {
            args: Prisma.OrdenAnalisisFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenAnalisisPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrdenAnalisisFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenAnalisisPayload>
          }
          findMany: {
            args: Prisma.OrdenAnalisisFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenAnalisisPayload>[]
          }
          create: {
            args: Prisma.OrdenAnalisisCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenAnalisisPayload>
          }
          createMany: {
            args: Prisma.OrdenAnalisisCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrdenAnalisisCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenAnalisisPayload>[]
          }
          delete: {
            args: Prisma.OrdenAnalisisDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenAnalisisPayload>
          }
          update: {
            args: Prisma.OrdenAnalisisUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenAnalisisPayload>
          }
          deleteMany: {
            args: Prisma.OrdenAnalisisDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrdenAnalisisUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OrdenAnalisisUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenAnalisisPayload>
          }
          aggregate: {
            args: Prisma.OrdenAnalisisAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrdenAnalisis>
          }
          groupBy: {
            args: Prisma.OrdenAnalisisGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrdenAnalisisGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrdenAnalisisCountArgs<ExtArgs>
            result: $Utils.Optional<OrdenAnalisisCountAggregateOutputType> | number
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
   * Count Type ConsultaCountOutputType
   */

  export type ConsultaCountOutputType = {
    ordenesAnalisis: number
  }

  export type ConsultaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ordenesAnalisis?: boolean | ConsultaCountOutputTypeCountOrdenesAnalisisArgs
  }

  // Custom InputTypes
  /**
   * ConsultaCountOutputType without action
   */
  export type ConsultaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsultaCountOutputType
     */
    select?: ConsultaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ConsultaCountOutputType without action
   */
  export type ConsultaCountOutputTypeCountOrdenesAnalisisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrdenAnalisisWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Consulta
   */

  export type AggregateConsulta = {
    _count: ConsultaCountAggregateOutputType | null
    _min: ConsultaMinAggregateOutputType | null
    _max: ConsultaMaxAggregateOutputType | null
  }

  export type ConsultaMinAggregateOutputType = {
    id: string | null
    pacienteId: string | null
    medicoId: string | null
    citaId: string | null
    estado: string | null
    motivoConsulta: string | null
    diagnostico: string | null
    notas: string | null
    fechaInicio: Date | null
    fechaFin: Date | null
    creadoEn: Date | null
    actualizadoEn: Date | null
  }

  export type ConsultaMaxAggregateOutputType = {
    id: string | null
    pacienteId: string | null
    medicoId: string | null
    citaId: string | null
    estado: string | null
    motivoConsulta: string | null
    diagnostico: string | null
    notas: string | null
    fechaInicio: Date | null
    fechaFin: Date | null
    creadoEn: Date | null
    actualizadoEn: Date | null
  }

  export type ConsultaCountAggregateOutputType = {
    id: number
    pacienteId: number
    medicoId: number
    citaId: number
    estado: number
    motivoConsulta: number
    diagnostico: number
    notas: number
    fechaInicio: number
    fechaFin: number
    creadoEn: number
    actualizadoEn: number
    _all: number
  }


  export type ConsultaMinAggregateInputType = {
    id?: true
    pacienteId?: true
    medicoId?: true
    citaId?: true
    estado?: true
    motivoConsulta?: true
    diagnostico?: true
    notas?: true
    fechaInicio?: true
    fechaFin?: true
    creadoEn?: true
    actualizadoEn?: true
  }

  export type ConsultaMaxAggregateInputType = {
    id?: true
    pacienteId?: true
    medicoId?: true
    citaId?: true
    estado?: true
    motivoConsulta?: true
    diagnostico?: true
    notas?: true
    fechaInicio?: true
    fechaFin?: true
    creadoEn?: true
    actualizadoEn?: true
  }

  export type ConsultaCountAggregateInputType = {
    id?: true
    pacienteId?: true
    medicoId?: true
    citaId?: true
    estado?: true
    motivoConsulta?: true
    diagnostico?: true
    notas?: true
    fechaInicio?: true
    fechaFin?: true
    creadoEn?: true
    actualizadoEn?: true
    _all?: true
  }

  export type ConsultaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Consulta to aggregate.
     */
    where?: ConsultaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Consultas to fetch.
     */
    orderBy?: ConsultaOrderByWithRelationInput | ConsultaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConsultaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Consultas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Consultas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Consultas
    **/
    _count?: true | ConsultaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConsultaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConsultaMaxAggregateInputType
  }

  export type GetConsultaAggregateType<T extends ConsultaAggregateArgs> = {
        [P in keyof T & keyof AggregateConsulta]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConsulta[P]>
      : GetScalarType<T[P], AggregateConsulta[P]>
  }




  export type ConsultaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConsultaWhereInput
    orderBy?: ConsultaOrderByWithAggregationInput | ConsultaOrderByWithAggregationInput[]
    by: ConsultaScalarFieldEnum[] | ConsultaScalarFieldEnum
    having?: ConsultaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConsultaCountAggregateInputType | true
    _min?: ConsultaMinAggregateInputType
    _max?: ConsultaMaxAggregateInputType
  }

  export type ConsultaGroupByOutputType = {
    id: string
    pacienteId: string
    medicoId: string
    citaId: string | null
    estado: string
    motivoConsulta: string | null
    diagnostico: string | null
    notas: string | null
    fechaInicio: Date
    fechaFin: Date | null
    creadoEn: Date
    actualizadoEn: Date
    _count: ConsultaCountAggregateOutputType | null
    _min: ConsultaMinAggregateOutputType | null
    _max: ConsultaMaxAggregateOutputType | null
  }

  type GetConsultaGroupByPayload<T extends ConsultaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConsultaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConsultaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConsultaGroupByOutputType[P]>
            : GetScalarType<T[P], ConsultaGroupByOutputType[P]>
        }
      >
    >


  export type ConsultaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pacienteId?: boolean
    medicoId?: boolean
    citaId?: boolean
    estado?: boolean
    motivoConsulta?: boolean
    diagnostico?: boolean
    notas?: boolean
    fechaInicio?: boolean
    fechaFin?: boolean
    creadoEn?: boolean
    actualizadoEn?: boolean
    ordenesAnalisis?: boolean | Consulta$ordenesAnalisisArgs<ExtArgs>
    _count?: boolean | ConsultaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["consulta"]>

  export type ConsultaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pacienteId?: boolean
    medicoId?: boolean
    citaId?: boolean
    estado?: boolean
    motivoConsulta?: boolean
    diagnostico?: boolean
    notas?: boolean
    fechaInicio?: boolean
    fechaFin?: boolean
    creadoEn?: boolean
    actualizadoEn?: boolean
  }, ExtArgs["result"]["consulta"]>

  export type ConsultaSelectScalar = {
    id?: boolean
    pacienteId?: boolean
    medicoId?: boolean
    citaId?: boolean
    estado?: boolean
    motivoConsulta?: boolean
    diagnostico?: boolean
    notas?: boolean
    fechaInicio?: boolean
    fechaFin?: boolean
    creadoEn?: boolean
    actualizadoEn?: boolean
  }

  export type ConsultaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ordenesAnalisis?: boolean | Consulta$ordenesAnalisisArgs<ExtArgs>
    _count?: boolean | ConsultaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ConsultaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ConsultaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Consulta"
    objects: {
      ordenesAnalisis: Prisma.$OrdenAnalisisPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      pacienteId: string
      medicoId: string
      citaId: string | null
      estado: string
      motivoConsulta: string | null
      diagnostico: string | null
      notas: string | null
      fechaInicio: Date
      fechaFin: Date | null
      creadoEn: Date
      actualizadoEn: Date
    }, ExtArgs["result"]["consulta"]>
    composites: {}
  }

  type ConsultaGetPayload<S extends boolean | null | undefined | ConsultaDefaultArgs> = $Result.GetResult<Prisma.$ConsultaPayload, S>

  type ConsultaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ConsultaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ConsultaCountAggregateInputType | true
    }

  export interface ConsultaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Consulta'], meta: { name: 'Consulta' } }
    /**
     * Find zero or one Consulta that matches the filter.
     * @param {ConsultaFindUniqueArgs} args - Arguments to find a Consulta
     * @example
     * // Get one Consulta
     * const consulta = await prisma.consulta.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConsultaFindUniqueArgs>(args: SelectSubset<T, ConsultaFindUniqueArgs<ExtArgs>>): Prisma__ConsultaClient<$Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Consulta that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ConsultaFindUniqueOrThrowArgs} args - Arguments to find a Consulta
     * @example
     * // Get one Consulta
     * const consulta = await prisma.consulta.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConsultaFindUniqueOrThrowArgs>(args: SelectSubset<T, ConsultaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConsultaClient<$Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Consulta that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsultaFindFirstArgs} args - Arguments to find a Consulta
     * @example
     * // Get one Consulta
     * const consulta = await prisma.consulta.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConsultaFindFirstArgs>(args?: SelectSubset<T, ConsultaFindFirstArgs<ExtArgs>>): Prisma__ConsultaClient<$Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Consulta that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsultaFindFirstOrThrowArgs} args - Arguments to find a Consulta
     * @example
     * // Get one Consulta
     * const consulta = await prisma.consulta.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConsultaFindFirstOrThrowArgs>(args?: SelectSubset<T, ConsultaFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConsultaClient<$Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Consultas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsultaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Consultas
     * const consultas = await prisma.consulta.findMany()
     * 
     * // Get first 10 Consultas
     * const consultas = await prisma.consulta.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const consultaWithIdOnly = await prisma.consulta.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConsultaFindManyArgs>(args?: SelectSubset<T, ConsultaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Consulta.
     * @param {ConsultaCreateArgs} args - Arguments to create a Consulta.
     * @example
     * // Create one Consulta
     * const Consulta = await prisma.consulta.create({
     *   data: {
     *     // ... data to create a Consulta
     *   }
     * })
     * 
     */
    create<T extends ConsultaCreateArgs>(args: SelectSubset<T, ConsultaCreateArgs<ExtArgs>>): Prisma__ConsultaClient<$Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Consultas.
     * @param {ConsultaCreateManyArgs} args - Arguments to create many Consultas.
     * @example
     * // Create many Consultas
     * const consulta = await prisma.consulta.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConsultaCreateManyArgs>(args?: SelectSubset<T, ConsultaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Consultas and returns the data saved in the database.
     * @param {ConsultaCreateManyAndReturnArgs} args - Arguments to create many Consultas.
     * @example
     * // Create many Consultas
     * const consulta = await prisma.consulta.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Consultas and only return the `id`
     * const consultaWithIdOnly = await prisma.consulta.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConsultaCreateManyAndReturnArgs>(args?: SelectSubset<T, ConsultaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Consulta.
     * @param {ConsultaDeleteArgs} args - Arguments to delete one Consulta.
     * @example
     * // Delete one Consulta
     * const Consulta = await prisma.consulta.delete({
     *   where: {
     *     // ... filter to delete one Consulta
     *   }
     * })
     * 
     */
    delete<T extends ConsultaDeleteArgs>(args: SelectSubset<T, ConsultaDeleteArgs<ExtArgs>>): Prisma__ConsultaClient<$Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Consulta.
     * @param {ConsultaUpdateArgs} args - Arguments to update one Consulta.
     * @example
     * // Update one Consulta
     * const consulta = await prisma.consulta.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConsultaUpdateArgs>(args: SelectSubset<T, ConsultaUpdateArgs<ExtArgs>>): Prisma__ConsultaClient<$Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Consultas.
     * @param {ConsultaDeleteManyArgs} args - Arguments to filter Consultas to delete.
     * @example
     * // Delete a few Consultas
     * const { count } = await prisma.consulta.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConsultaDeleteManyArgs>(args?: SelectSubset<T, ConsultaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Consultas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsultaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Consultas
     * const consulta = await prisma.consulta.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConsultaUpdateManyArgs>(args: SelectSubset<T, ConsultaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Consulta.
     * @param {ConsultaUpsertArgs} args - Arguments to update or create a Consulta.
     * @example
     * // Update or create a Consulta
     * const consulta = await prisma.consulta.upsert({
     *   create: {
     *     // ... data to create a Consulta
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Consulta we want to update
     *   }
     * })
     */
    upsert<T extends ConsultaUpsertArgs>(args: SelectSubset<T, ConsultaUpsertArgs<ExtArgs>>): Prisma__ConsultaClient<$Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Consultas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsultaCountArgs} args - Arguments to filter Consultas to count.
     * @example
     * // Count the number of Consultas
     * const count = await prisma.consulta.count({
     *   where: {
     *     // ... the filter for the Consultas we want to count
     *   }
     * })
    **/
    count<T extends ConsultaCountArgs>(
      args?: Subset<T, ConsultaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConsultaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Consulta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsultaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ConsultaAggregateArgs>(args: Subset<T, ConsultaAggregateArgs>): Prisma.PrismaPromise<GetConsultaAggregateType<T>>

    /**
     * Group by Consulta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsultaGroupByArgs} args - Group by arguments.
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
      T extends ConsultaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConsultaGroupByArgs['orderBy'] }
        : { orderBy?: ConsultaGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ConsultaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConsultaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Consulta model
   */
  readonly fields: ConsultaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Consulta.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConsultaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ordenesAnalisis<T extends Consulta$ordenesAnalisisArgs<ExtArgs> = {}>(args?: Subset<T, Consulta$ordenesAnalisisArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrdenAnalisisPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Consulta model
   */ 
  interface ConsultaFieldRefs {
    readonly id: FieldRef<"Consulta", 'String'>
    readonly pacienteId: FieldRef<"Consulta", 'String'>
    readonly medicoId: FieldRef<"Consulta", 'String'>
    readonly citaId: FieldRef<"Consulta", 'String'>
    readonly estado: FieldRef<"Consulta", 'String'>
    readonly motivoConsulta: FieldRef<"Consulta", 'String'>
    readonly diagnostico: FieldRef<"Consulta", 'String'>
    readonly notas: FieldRef<"Consulta", 'String'>
    readonly fechaInicio: FieldRef<"Consulta", 'DateTime'>
    readonly fechaFin: FieldRef<"Consulta", 'DateTime'>
    readonly creadoEn: FieldRef<"Consulta", 'DateTime'>
    readonly actualizadoEn: FieldRef<"Consulta", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Consulta findUnique
   */
  export type ConsultaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Consulta
     */
    select?: ConsultaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsultaInclude<ExtArgs> | null
    /**
     * Filter, which Consulta to fetch.
     */
    where: ConsultaWhereUniqueInput
  }

  /**
   * Consulta findUniqueOrThrow
   */
  export type ConsultaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Consulta
     */
    select?: ConsultaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsultaInclude<ExtArgs> | null
    /**
     * Filter, which Consulta to fetch.
     */
    where: ConsultaWhereUniqueInput
  }

  /**
   * Consulta findFirst
   */
  export type ConsultaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Consulta
     */
    select?: ConsultaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsultaInclude<ExtArgs> | null
    /**
     * Filter, which Consulta to fetch.
     */
    where?: ConsultaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Consultas to fetch.
     */
    orderBy?: ConsultaOrderByWithRelationInput | ConsultaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Consultas.
     */
    cursor?: ConsultaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Consultas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Consultas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Consultas.
     */
    distinct?: ConsultaScalarFieldEnum | ConsultaScalarFieldEnum[]
  }

  /**
   * Consulta findFirstOrThrow
   */
  export type ConsultaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Consulta
     */
    select?: ConsultaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsultaInclude<ExtArgs> | null
    /**
     * Filter, which Consulta to fetch.
     */
    where?: ConsultaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Consultas to fetch.
     */
    orderBy?: ConsultaOrderByWithRelationInput | ConsultaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Consultas.
     */
    cursor?: ConsultaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Consultas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Consultas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Consultas.
     */
    distinct?: ConsultaScalarFieldEnum | ConsultaScalarFieldEnum[]
  }

  /**
   * Consulta findMany
   */
  export type ConsultaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Consulta
     */
    select?: ConsultaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsultaInclude<ExtArgs> | null
    /**
     * Filter, which Consultas to fetch.
     */
    where?: ConsultaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Consultas to fetch.
     */
    orderBy?: ConsultaOrderByWithRelationInput | ConsultaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Consultas.
     */
    cursor?: ConsultaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Consultas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Consultas.
     */
    skip?: number
    distinct?: ConsultaScalarFieldEnum | ConsultaScalarFieldEnum[]
  }

  /**
   * Consulta create
   */
  export type ConsultaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Consulta
     */
    select?: ConsultaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsultaInclude<ExtArgs> | null
    /**
     * The data needed to create a Consulta.
     */
    data: XOR<ConsultaCreateInput, ConsultaUncheckedCreateInput>
  }

  /**
   * Consulta createMany
   */
  export type ConsultaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Consultas.
     */
    data: ConsultaCreateManyInput | ConsultaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Consulta createManyAndReturn
   */
  export type ConsultaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Consulta
     */
    select?: ConsultaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Consultas.
     */
    data: ConsultaCreateManyInput | ConsultaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Consulta update
   */
  export type ConsultaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Consulta
     */
    select?: ConsultaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsultaInclude<ExtArgs> | null
    /**
     * The data needed to update a Consulta.
     */
    data: XOR<ConsultaUpdateInput, ConsultaUncheckedUpdateInput>
    /**
     * Choose, which Consulta to update.
     */
    where: ConsultaWhereUniqueInput
  }

  /**
   * Consulta updateMany
   */
  export type ConsultaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Consultas.
     */
    data: XOR<ConsultaUpdateManyMutationInput, ConsultaUncheckedUpdateManyInput>
    /**
     * Filter which Consultas to update
     */
    where?: ConsultaWhereInput
  }

  /**
   * Consulta upsert
   */
  export type ConsultaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Consulta
     */
    select?: ConsultaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsultaInclude<ExtArgs> | null
    /**
     * The filter to search for the Consulta to update in case it exists.
     */
    where: ConsultaWhereUniqueInput
    /**
     * In case the Consulta found by the `where` argument doesn't exist, create a new Consulta with this data.
     */
    create: XOR<ConsultaCreateInput, ConsultaUncheckedCreateInput>
    /**
     * In case the Consulta was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConsultaUpdateInput, ConsultaUncheckedUpdateInput>
  }

  /**
   * Consulta delete
   */
  export type ConsultaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Consulta
     */
    select?: ConsultaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsultaInclude<ExtArgs> | null
    /**
     * Filter which Consulta to delete.
     */
    where: ConsultaWhereUniqueInput
  }

  /**
   * Consulta deleteMany
   */
  export type ConsultaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Consultas to delete
     */
    where?: ConsultaWhereInput
  }

  /**
   * Consulta.ordenesAnalisis
   */
  export type Consulta$ordenesAnalisisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenAnalisis
     */
    select?: OrdenAnalisisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenAnalisisInclude<ExtArgs> | null
    where?: OrdenAnalisisWhereInput
    orderBy?: OrdenAnalisisOrderByWithRelationInput | OrdenAnalisisOrderByWithRelationInput[]
    cursor?: OrdenAnalisisWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrdenAnalisisScalarFieldEnum | OrdenAnalisisScalarFieldEnum[]
  }

  /**
   * Consulta without action
   */
  export type ConsultaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Consulta
     */
    select?: ConsultaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsultaInclude<ExtArgs> | null
  }


  /**
   * Model OrdenAnalisis
   */

  export type AggregateOrdenAnalisis = {
    _count: OrdenAnalisisCountAggregateOutputType | null
    _min: OrdenAnalisisMinAggregateOutputType | null
    _max: OrdenAnalisisMaxAggregateOutputType | null
  }

  export type OrdenAnalisisMinAggregateOutputType = {
    id: string | null
    consultaId: string | null
    tipoAnalisis: string | null
    descripcion: string | null
    estado: string | null
    resultado: string | null
    archivoId: string | null
    creadoEn: Date | null
    actualizadoEn: Date | null
  }

  export type OrdenAnalisisMaxAggregateOutputType = {
    id: string | null
    consultaId: string | null
    tipoAnalisis: string | null
    descripcion: string | null
    estado: string | null
    resultado: string | null
    archivoId: string | null
    creadoEn: Date | null
    actualizadoEn: Date | null
  }

  export type OrdenAnalisisCountAggregateOutputType = {
    id: number
    consultaId: number
    tipoAnalisis: number
    descripcion: number
    estado: number
    resultado: number
    archivoId: number
    creadoEn: number
    actualizadoEn: number
    _all: number
  }


  export type OrdenAnalisisMinAggregateInputType = {
    id?: true
    consultaId?: true
    tipoAnalisis?: true
    descripcion?: true
    estado?: true
    resultado?: true
    archivoId?: true
    creadoEn?: true
    actualizadoEn?: true
  }

  export type OrdenAnalisisMaxAggregateInputType = {
    id?: true
    consultaId?: true
    tipoAnalisis?: true
    descripcion?: true
    estado?: true
    resultado?: true
    archivoId?: true
    creadoEn?: true
    actualizadoEn?: true
  }

  export type OrdenAnalisisCountAggregateInputType = {
    id?: true
    consultaId?: true
    tipoAnalisis?: true
    descripcion?: true
    estado?: true
    resultado?: true
    archivoId?: true
    creadoEn?: true
    actualizadoEn?: true
    _all?: true
  }

  export type OrdenAnalisisAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrdenAnalisis to aggregate.
     */
    where?: OrdenAnalisisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrdenAnalises to fetch.
     */
    orderBy?: OrdenAnalisisOrderByWithRelationInput | OrdenAnalisisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrdenAnalisisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrdenAnalises from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrdenAnalises.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OrdenAnalises
    **/
    _count?: true | OrdenAnalisisCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrdenAnalisisMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrdenAnalisisMaxAggregateInputType
  }

  export type GetOrdenAnalisisAggregateType<T extends OrdenAnalisisAggregateArgs> = {
        [P in keyof T & keyof AggregateOrdenAnalisis]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrdenAnalisis[P]>
      : GetScalarType<T[P], AggregateOrdenAnalisis[P]>
  }




  export type OrdenAnalisisGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrdenAnalisisWhereInput
    orderBy?: OrdenAnalisisOrderByWithAggregationInput | OrdenAnalisisOrderByWithAggregationInput[]
    by: OrdenAnalisisScalarFieldEnum[] | OrdenAnalisisScalarFieldEnum
    having?: OrdenAnalisisScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrdenAnalisisCountAggregateInputType | true
    _min?: OrdenAnalisisMinAggregateInputType
    _max?: OrdenAnalisisMaxAggregateInputType
  }

  export type OrdenAnalisisGroupByOutputType = {
    id: string
    consultaId: string
    tipoAnalisis: string
    descripcion: string | null
    estado: string
    resultado: string | null
    archivoId: string | null
    creadoEn: Date
    actualizadoEn: Date
    _count: OrdenAnalisisCountAggregateOutputType | null
    _min: OrdenAnalisisMinAggregateOutputType | null
    _max: OrdenAnalisisMaxAggregateOutputType | null
  }

  type GetOrdenAnalisisGroupByPayload<T extends OrdenAnalisisGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrdenAnalisisGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrdenAnalisisGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrdenAnalisisGroupByOutputType[P]>
            : GetScalarType<T[P], OrdenAnalisisGroupByOutputType[P]>
        }
      >
    >


  export type OrdenAnalisisSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    consultaId?: boolean
    tipoAnalisis?: boolean
    descripcion?: boolean
    estado?: boolean
    resultado?: boolean
    archivoId?: boolean
    creadoEn?: boolean
    actualizadoEn?: boolean
    consulta?: boolean | ConsultaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ordenAnalisis"]>

  export type OrdenAnalisisSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    consultaId?: boolean
    tipoAnalisis?: boolean
    descripcion?: boolean
    estado?: boolean
    resultado?: boolean
    archivoId?: boolean
    creadoEn?: boolean
    actualizadoEn?: boolean
    consulta?: boolean | ConsultaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ordenAnalisis"]>

  export type OrdenAnalisisSelectScalar = {
    id?: boolean
    consultaId?: boolean
    tipoAnalisis?: boolean
    descripcion?: boolean
    estado?: boolean
    resultado?: boolean
    archivoId?: boolean
    creadoEn?: boolean
    actualizadoEn?: boolean
  }

  export type OrdenAnalisisInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    consulta?: boolean | ConsultaDefaultArgs<ExtArgs>
  }
  export type OrdenAnalisisIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    consulta?: boolean | ConsultaDefaultArgs<ExtArgs>
  }

  export type $OrdenAnalisisPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OrdenAnalisis"
    objects: {
      consulta: Prisma.$ConsultaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      consultaId: string
      tipoAnalisis: string
      descripcion: string | null
      estado: string
      resultado: string | null
      archivoId: string | null
      creadoEn: Date
      actualizadoEn: Date
    }, ExtArgs["result"]["ordenAnalisis"]>
    composites: {}
  }

  type OrdenAnalisisGetPayload<S extends boolean | null | undefined | OrdenAnalisisDefaultArgs> = $Result.GetResult<Prisma.$OrdenAnalisisPayload, S>

  type OrdenAnalisisCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<OrdenAnalisisFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: OrdenAnalisisCountAggregateInputType | true
    }

  export interface OrdenAnalisisDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OrdenAnalisis'], meta: { name: 'OrdenAnalisis' } }
    /**
     * Find zero or one OrdenAnalisis that matches the filter.
     * @param {OrdenAnalisisFindUniqueArgs} args - Arguments to find a OrdenAnalisis
     * @example
     * // Get one OrdenAnalisis
     * const ordenAnalisis = await prisma.ordenAnalisis.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrdenAnalisisFindUniqueArgs>(args: SelectSubset<T, OrdenAnalisisFindUniqueArgs<ExtArgs>>): Prisma__OrdenAnalisisClient<$Result.GetResult<Prisma.$OrdenAnalisisPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one OrdenAnalisis that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {OrdenAnalisisFindUniqueOrThrowArgs} args - Arguments to find a OrdenAnalisis
     * @example
     * // Get one OrdenAnalisis
     * const ordenAnalisis = await prisma.ordenAnalisis.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrdenAnalisisFindUniqueOrThrowArgs>(args: SelectSubset<T, OrdenAnalisisFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrdenAnalisisClient<$Result.GetResult<Prisma.$OrdenAnalisisPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first OrdenAnalisis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdenAnalisisFindFirstArgs} args - Arguments to find a OrdenAnalisis
     * @example
     * // Get one OrdenAnalisis
     * const ordenAnalisis = await prisma.ordenAnalisis.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrdenAnalisisFindFirstArgs>(args?: SelectSubset<T, OrdenAnalisisFindFirstArgs<ExtArgs>>): Prisma__OrdenAnalisisClient<$Result.GetResult<Prisma.$OrdenAnalisisPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first OrdenAnalisis that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdenAnalisisFindFirstOrThrowArgs} args - Arguments to find a OrdenAnalisis
     * @example
     * // Get one OrdenAnalisis
     * const ordenAnalisis = await prisma.ordenAnalisis.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrdenAnalisisFindFirstOrThrowArgs>(args?: SelectSubset<T, OrdenAnalisisFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrdenAnalisisClient<$Result.GetResult<Prisma.$OrdenAnalisisPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more OrdenAnalises that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdenAnalisisFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OrdenAnalises
     * const ordenAnalises = await prisma.ordenAnalisis.findMany()
     * 
     * // Get first 10 OrdenAnalises
     * const ordenAnalises = await prisma.ordenAnalisis.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ordenAnalisisWithIdOnly = await prisma.ordenAnalisis.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrdenAnalisisFindManyArgs>(args?: SelectSubset<T, OrdenAnalisisFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrdenAnalisisPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a OrdenAnalisis.
     * @param {OrdenAnalisisCreateArgs} args - Arguments to create a OrdenAnalisis.
     * @example
     * // Create one OrdenAnalisis
     * const OrdenAnalisis = await prisma.ordenAnalisis.create({
     *   data: {
     *     // ... data to create a OrdenAnalisis
     *   }
     * })
     * 
     */
    create<T extends OrdenAnalisisCreateArgs>(args: SelectSubset<T, OrdenAnalisisCreateArgs<ExtArgs>>): Prisma__OrdenAnalisisClient<$Result.GetResult<Prisma.$OrdenAnalisisPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many OrdenAnalises.
     * @param {OrdenAnalisisCreateManyArgs} args - Arguments to create many OrdenAnalises.
     * @example
     * // Create many OrdenAnalises
     * const ordenAnalisis = await prisma.ordenAnalisis.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrdenAnalisisCreateManyArgs>(args?: SelectSubset<T, OrdenAnalisisCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OrdenAnalises and returns the data saved in the database.
     * @param {OrdenAnalisisCreateManyAndReturnArgs} args - Arguments to create many OrdenAnalises.
     * @example
     * // Create many OrdenAnalises
     * const ordenAnalisis = await prisma.ordenAnalisis.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OrdenAnalises and only return the `id`
     * const ordenAnalisisWithIdOnly = await prisma.ordenAnalisis.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrdenAnalisisCreateManyAndReturnArgs>(args?: SelectSubset<T, OrdenAnalisisCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrdenAnalisisPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a OrdenAnalisis.
     * @param {OrdenAnalisisDeleteArgs} args - Arguments to delete one OrdenAnalisis.
     * @example
     * // Delete one OrdenAnalisis
     * const OrdenAnalisis = await prisma.ordenAnalisis.delete({
     *   where: {
     *     // ... filter to delete one OrdenAnalisis
     *   }
     * })
     * 
     */
    delete<T extends OrdenAnalisisDeleteArgs>(args: SelectSubset<T, OrdenAnalisisDeleteArgs<ExtArgs>>): Prisma__OrdenAnalisisClient<$Result.GetResult<Prisma.$OrdenAnalisisPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one OrdenAnalisis.
     * @param {OrdenAnalisisUpdateArgs} args - Arguments to update one OrdenAnalisis.
     * @example
     * // Update one OrdenAnalisis
     * const ordenAnalisis = await prisma.ordenAnalisis.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrdenAnalisisUpdateArgs>(args: SelectSubset<T, OrdenAnalisisUpdateArgs<ExtArgs>>): Prisma__OrdenAnalisisClient<$Result.GetResult<Prisma.$OrdenAnalisisPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more OrdenAnalises.
     * @param {OrdenAnalisisDeleteManyArgs} args - Arguments to filter OrdenAnalises to delete.
     * @example
     * // Delete a few OrdenAnalises
     * const { count } = await prisma.ordenAnalisis.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrdenAnalisisDeleteManyArgs>(args?: SelectSubset<T, OrdenAnalisisDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrdenAnalises.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdenAnalisisUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OrdenAnalises
     * const ordenAnalisis = await prisma.ordenAnalisis.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrdenAnalisisUpdateManyArgs>(args: SelectSubset<T, OrdenAnalisisUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one OrdenAnalisis.
     * @param {OrdenAnalisisUpsertArgs} args - Arguments to update or create a OrdenAnalisis.
     * @example
     * // Update or create a OrdenAnalisis
     * const ordenAnalisis = await prisma.ordenAnalisis.upsert({
     *   create: {
     *     // ... data to create a OrdenAnalisis
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OrdenAnalisis we want to update
     *   }
     * })
     */
    upsert<T extends OrdenAnalisisUpsertArgs>(args: SelectSubset<T, OrdenAnalisisUpsertArgs<ExtArgs>>): Prisma__OrdenAnalisisClient<$Result.GetResult<Prisma.$OrdenAnalisisPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of OrdenAnalises.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdenAnalisisCountArgs} args - Arguments to filter OrdenAnalises to count.
     * @example
     * // Count the number of OrdenAnalises
     * const count = await prisma.ordenAnalisis.count({
     *   where: {
     *     // ... the filter for the OrdenAnalises we want to count
     *   }
     * })
    **/
    count<T extends OrdenAnalisisCountArgs>(
      args?: Subset<T, OrdenAnalisisCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrdenAnalisisCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OrdenAnalisis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdenAnalisisAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OrdenAnalisisAggregateArgs>(args: Subset<T, OrdenAnalisisAggregateArgs>): Prisma.PrismaPromise<GetOrdenAnalisisAggregateType<T>>

    /**
     * Group by OrdenAnalisis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdenAnalisisGroupByArgs} args - Group by arguments.
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
      T extends OrdenAnalisisGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrdenAnalisisGroupByArgs['orderBy'] }
        : { orderBy?: OrdenAnalisisGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OrdenAnalisisGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrdenAnalisisGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OrdenAnalisis model
   */
  readonly fields: OrdenAnalisisFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OrdenAnalisis.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrdenAnalisisClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    consulta<T extends ConsultaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ConsultaDefaultArgs<ExtArgs>>): Prisma__ConsultaClient<$Result.GetResult<Prisma.$ConsultaPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the OrdenAnalisis model
   */ 
  interface OrdenAnalisisFieldRefs {
    readonly id: FieldRef<"OrdenAnalisis", 'String'>
    readonly consultaId: FieldRef<"OrdenAnalisis", 'String'>
    readonly tipoAnalisis: FieldRef<"OrdenAnalisis", 'String'>
    readonly descripcion: FieldRef<"OrdenAnalisis", 'String'>
    readonly estado: FieldRef<"OrdenAnalisis", 'String'>
    readonly resultado: FieldRef<"OrdenAnalisis", 'String'>
    readonly archivoId: FieldRef<"OrdenAnalisis", 'String'>
    readonly creadoEn: FieldRef<"OrdenAnalisis", 'DateTime'>
    readonly actualizadoEn: FieldRef<"OrdenAnalisis", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OrdenAnalisis findUnique
   */
  export type OrdenAnalisisFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenAnalisis
     */
    select?: OrdenAnalisisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenAnalisisInclude<ExtArgs> | null
    /**
     * Filter, which OrdenAnalisis to fetch.
     */
    where: OrdenAnalisisWhereUniqueInput
  }

  /**
   * OrdenAnalisis findUniqueOrThrow
   */
  export type OrdenAnalisisFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenAnalisis
     */
    select?: OrdenAnalisisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenAnalisisInclude<ExtArgs> | null
    /**
     * Filter, which OrdenAnalisis to fetch.
     */
    where: OrdenAnalisisWhereUniqueInput
  }

  /**
   * OrdenAnalisis findFirst
   */
  export type OrdenAnalisisFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenAnalisis
     */
    select?: OrdenAnalisisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenAnalisisInclude<ExtArgs> | null
    /**
     * Filter, which OrdenAnalisis to fetch.
     */
    where?: OrdenAnalisisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrdenAnalises to fetch.
     */
    orderBy?: OrdenAnalisisOrderByWithRelationInput | OrdenAnalisisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrdenAnalises.
     */
    cursor?: OrdenAnalisisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrdenAnalises from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrdenAnalises.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrdenAnalises.
     */
    distinct?: OrdenAnalisisScalarFieldEnum | OrdenAnalisisScalarFieldEnum[]
  }

  /**
   * OrdenAnalisis findFirstOrThrow
   */
  export type OrdenAnalisisFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenAnalisis
     */
    select?: OrdenAnalisisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenAnalisisInclude<ExtArgs> | null
    /**
     * Filter, which OrdenAnalisis to fetch.
     */
    where?: OrdenAnalisisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrdenAnalises to fetch.
     */
    orderBy?: OrdenAnalisisOrderByWithRelationInput | OrdenAnalisisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrdenAnalises.
     */
    cursor?: OrdenAnalisisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrdenAnalises from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrdenAnalises.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrdenAnalises.
     */
    distinct?: OrdenAnalisisScalarFieldEnum | OrdenAnalisisScalarFieldEnum[]
  }

  /**
   * OrdenAnalisis findMany
   */
  export type OrdenAnalisisFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenAnalisis
     */
    select?: OrdenAnalisisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenAnalisisInclude<ExtArgs> | null
    /**
     * Filter, which OrdenAnalises to fetch.
     */
    where?: OrdenAnalisisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrdenAnalises to fetch.
     */
    orderBy?: OrdenAnalisisOrderByWithRelationInput | OrdenAnalisisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OrdenAnalises.
     */
    cursor?: OrdenAnalisisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrdenAnalises from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrdenAnalises.
     */
    skip?: number
    distinct?: OrdenAnalisisScalarFieldEnum | OrdenAnalisisScalarFieldEnum[]
  }

  /**
   * OrdenAnalisis create
   */
  export type OrdenAnalisisCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenAnalisis
     */
    select?: OrdenAnalisisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenAnalisisInclude<ExtArgs> | null
    /**
     * The data needed to create a OrdenAnalisis.
     */
    data: XOR<OrdenAnalisisCreateInput, OrdenAnalisisUncheckedCreateInput>
  }

  /**
   * OrdenAnalisis createMany
   */
  export type OrdenAnalisisCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OrdenAnalises.
     */
    data: OrdenAnalisisCreateManyInput | OrdenAnalisisCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OrdenAnalisis createManyAndReturn
   */
  export type OrdenAnalisisCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenAnalisis
     */
    select?: OrdenAnalisisSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many OrdenAnalises.
     */
    data: OrdenAnalisisCreateManyInput | OrdenAnalisisCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenAnalisisIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrdenAnalisis update
   */
  export type OrdenAnalisisUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenAnalisis
     */
    select?: OrdenAnalisisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenAnalisisInclude<ExtArgs> | null
    /**
     * The data needed to update a OrdenAnalisis.
     */
    data: XOR<OrdenAnalisisUpdateInput, OrdenAnalisisUncheckedUpdateInput>
    /**
     * Choose, which OrdenAnalisis to update.
     */
    where: OrdenAnalisisWhereUniqueInput
  }

  /**
   * OrdenAnalisis updateMany
   */
  export type OrdenAnalisisUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OrdenAnalises.
     */
    data: XOR<OrdenAnalisisUpdateManyMutationInput, OrdenAnalisisUncheckedUpdateManyInput>
    /**
     * Filter which OrdenAnalises to update
     */
    where?: OrdenAnalisisWhereInput
  }

  /**
   * OrdenAnalisis upsert
   */
  export type OrdenAnalisisUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenAnalisis
     */
    select?: OrdenAnalisisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenAnalisisInclude<ExtArgs> | null
    /**
     * The filter to search for the OrdenAnalisis to update in case it exists.
     */
    where: OrdenAnalisisWhereUniqueInput
    /**
     * In case the OrdenAnalisis found by the `where` argument doesn't exist, create a new OrdenAnalisis with this data.
     */
    create: XOR<OrdenAnalisisCreateInput, OrdenAnalisisUncheckedCreateInput>
    /**
     * In case the OrdenAnalisis was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrdenAnalisisUpdateInput, OrdenAnalisisUncheckedUpdateInput>
  }

  /**
   * OrdenAnalisis delete
   */
  export type OrdenAnalisisDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenAnalisis
     */
    select?: OrdenAnalisisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenAnalisisInclude<ExtArgs> | null
    /**
     * Filter which OrdenAnalisis to delete.
     */
    where: OrdenAnalisisWhereUniqueInput
  }

  /**
   * OrdenAnalisis deleteMany
   */
  export type OrdenAnalisisDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrdenAnalises to delete
     */
    where?: OrdenAnalisisWhereInput
  }

  /**
   * OrdenAnalisis without action
   */
  export type OrdenAnalisisDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenAnalisis
     */
    select?: OrdenAnalisisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenAnalisisInclude<ExtArgs> | null
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


  export const ConsultaScalarFieldEnum: {
    id: 'id',
    pacienteId: 'pacienteId',
    medicoId: 'medicoId',
    citaId: 'citaId',
    estado: 'estado',
    motivoConsulta: 'motivoConsulta',
    diagnostico: 'diagnostico',
    notas: 'notas',
    fechaInicio: 'fechaInicio',
    fechaFin: 'fechaFin',
    creadoEn: 'creadoEn',
    actualizadoEn: 'actualizadoEn'
  };

  export type ConsultaScalarFieldEnum = (typeof ConsultaScalarFieldEnum)[keyof typeof ConsultaScalarFieldEnum]


  export const OrdenAnalisisScalarFieldEnum: {
    id: 'id',
    consultaId: 'consultaId',
    tipoAnalisis: 'tipoAnalisis',
    descripcion: 'descripcion',
    estado: 'estado',
    resultado: 'resultado',
    archivoId: 'archivoId',
    creadoEn: 'creadoEn',
    actualizadoEn: 'actualizadoEn'
  };

  export type OrdenAnalisisScalarFieldEnum = (typeof OrdenAnalisisScalarFieldEnum)[keyof typeof OrdenAnalisisScalarFieldEnum]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type ConsultaWhereInput = {
    AND?: ConsultaWhereInput | ConsultaWhereInput[]
    OR?: ConsultaWhereInput[]
    NOT?: ConsultaWhereInput | ConsultaWhereInput[]
    id?: StringFilter<"Consulta"> | string
    pacienteId?: StringFilter<"Consulta"> | string
    medicoId?: StringFilter<"Consulta"> | string
    citaId?: StringNullableFilter<"Consulta"> | string | null
    estado?: StringFilter<"Consulta"> | string
    motivoConsulta?: StringNullableFilter<"Consulta"> | string | null
    diagnostico?: StringNullableFilter<"Consulta"> | string | null
    notas?: StringNullableFilter<"Consulta"> | string | null
    fechaInicio?: DateTimeFilter<"Consulta"> | Date | string
    fechaFin?: DateTimeNullableFilter<"Consulta"> | Date | string | null
    creadoEn?: DateTimeFilter<"Consulta"> | Date | string
    actualizadoEn?: DateTimeFilter<"Consulta"> | Date | string
    ordenesAnalisis?: OrdenAnalisisListRelationFilter
  }

  export type ConsultaOrderByWithRelationInput = {
    id?: SortOrder
    pacienteId?: SortOrder
    medicoId?: SortOrder
    citaId?: SortOrderInput | SortOrder
    estado?: SortOrder
    motivoConsulta?: SortOrderInput | SortOrder
    diagnostico?: SortOrderInput | SortOrder
    notas?: SortOrderInput | SortOrder
    fechaInicio?: SortOrder
    fechaFin?: SortOrderInput | SortOrder
    creadoEn?: SortOrder
    actualizadoEn?: SortOrder
    ordenesAnalisis?: OrdenAnalisisOrderByRelationAggregateInput
  }

  export type ConsultaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConsultaWhereInput | ConsultaWhereInput[]
    OR?: ConsultaWhereInput[]
    NOT?: ConsultaWhereInput | ConsultaWhereInput[]
    pacienteId?: StringFilter<"Consulta"> | string
    medicoId?: StringFilter<"Consulta"> | string
    citaId?: StringNullableFilter<"Consulta"> | string | null
    estado?: StringFilter<"Consulta"> | string
    motivoConsulta?: StringNullableFilter<"Consulta"> | string | null
    diagnostico?: StringNullableFilter<"Consulta"> | string | null
    notas?: StringNullableFilter<"Consulta"> | string | null
    fechaInicio?: DateTimeFilter<"Consulta"> | Date | string
    fechaFin?: DateTimeNullableFilter<"Consulta"> | Date | string | null
    creadoEn?: DateTimeFilter<"Consulta"> | Date | string
    actualizadoEn?: DateTimeFilter<"Consulta"> | Date | string
    ordenesAnalisis?: OrdenAnalisisListRelationFilter
  }, "id">

  export type ConsultaOrderByWithAggregationInput = {
    id?: SortOrder
    pacienteId?: SortOrder
    medicoId?: SortOrder
    citaId?: SortOrderInput | SortOrder
    estado?: SortOrder
    motivoConsulta?: SortOrderInput | SortOrder
    diagnostico?: SortOrderInput | SortOrder
    notas?: SortOrderInput | SortOrder
    fechaInicio?: SortOrder
    fechaFin?: SortOrderInput | SortOrder
    creadoEn?: SortOrder
    actualizadoEn?: SortOrder
    _count?: ConsultaCountOrderByAggregateInput
    _max?: ConsultaMaxOrderByAggregateInput
    _min?: ConsultaMinOrderByAggregateInput
  }

  export type ConsultaScalarWhereWithAggregatesInput = {
    AND?: ConsultaScalarWhereWithAggregatesInput | ConsultaScalarWhereWithAggregatesInput[]
    OR?: ConsultaScalarWhereWithAggregatesInput[]
    NOT?: ConsultaScalarWhereWithAggregatesInput | ConsultaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Consulta"> | string
    pacienteId?: StringWithAggregatesFilter<"Consulta"> | string
    medicoId?: StringWithAggregatesFilter<"Consulta"> | string
    citaId?: StringNullableWithAggregatesFilter<"Consulta"> | string | null
    estado?: StringWithAggregatesFilter<"Consulta"> | string
    motivoConsulta?: StringNullableWithAggregatesFilter<"Consulta"> | string | null
    diagnostico?: StringNullableWithAggregatesFilter<"Consulta"> | string | null
    notas?: StringNullableWithAggregatesFilter<"Consulta"> | string | null
    fechaInicio?: DateTimeWithAggregatesFilter<"Consulta"> | Date | string
    fechaFin?: DateTimeNullableWithAggregatesFilter<"Consulta"> | Date | string | null
    creadoEn?: DateTimeWithAggregatesFilter<"Consulta"> | Date | string
    actualizadoEn?: DateTimeWithAggregatesFilter<"Consulta"> | Date | string
  }

  export type OrdenAnalisisWhereInput = {
    AND?: OrdenAnalisisWhereInput | OrdenAnalisisWhereInput[]
    OR?: OrdenAnalisisWhereInput[]
    NOT?: OrdenAnalisisWhereInput | OrdenAnalisisWhereInput[]
    id?: StringFilter<"OrdenAnalisis"> | string
    consultaId?: StringFilter<"OrdenAnalisis"> | string
    tipoAnalisis?: StringFilter<"OrdenAnalisis"> | string
    descripcion?: StringNullableFilter<"OrdenAnalisis"> | string | null
    estado?: StringFilter<"OrdenAnalisis"> | string
    resultado?: StringNullableFilter<"OrdenAnalisis"> | string | null
    archivoId?: StringNullableFilter<"OrdenAnalisis"> | string | null
    creadoEn?: DateTimeFilter<"OrdenAnalisis"> | Date | string
    actualizadoEn?: DateTimeFilter<"OrdenAnalisis"> | Date | string
    consulta?: XOR<ConsultaRelationFilter, ConsultaWhereInput>
  }

  export type OrdenAnalisisOrderByWithRelationInput = {
    id?: SortOrder
    consultaId?: SortOrder
    tipoAnalisis?: SortOrder
    descripcion?: SortOrderInput | SortOrder
    estado?: SortOrder
    resultado?: SortOrderInput | SortOrder
    archivoId?: SortOrderInput | SortOrder
    creadoEn?: SortOrder
    actualizadoEn?: SortOrder
    consulta?: ConsultaOrderByWithRelationInput
  }

  export type OrdenAnalisisWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OrdenAnalisisWhereInput | OrdenAnalisisWhereInput[]
    OR?: OrdenAnalisisWhereInput[]
    NOT?: OrdenAnalisisWhereInput | OrdenAnalisisWhereInput[]
    consultaId?: StringFilter<"OrdenAnalisis"> | string
    tipoAnalisis?: StringFilter<"OrdenAnalisis"> | string
    descripcion?: StringNullableFilter<"OrdenAnalisis"> | string | null
    estado?: StringFilter<"OrdenAnalisis"> | string
    resultado?: StringNullableFilter<"OrdenAnalisis"> | string | null
    archivoId?: StringNullableFilter<"OrdenAnalisis"> | string | null
    creadoEn?: DateTimeFilter<"OrdenAnalisis"> | Date | string
    actualizadoEn?: DateTimeFilter<"OrdenAnalisis"> | Date | string
    consulta?: XOR<ConsultaRelationFilter, ConsultaWhereInput>
  }, "id">

  export type OrdenAnalisisOrderByWithAggregationInput = {
    id?: SortOrder
    consultaId?: SortOrder
    tipoAnalisis?: SortOrder
    descripcion?: SortOrderInput | SortOrder
    estado?: SortOrder
    resultado?: SortOrderInput | SortOrder
    archivoId?: SortOrderInput | SortOrder
    creadoEn?: SortOrder
    actualizadoEn?: SortOrder
    _count?: OrdenAnalisisCountOrderByAggregateInput
    _max?: OrdenAnalisisMaxOrderByAggregateInput
    _min?: OrdenAnalisisMinOrderByAggregateInput
  }

  export type OrdenAnalisisScalarWhereWithAggregatesInput = {
    AND?: OrdenAnalisisScalarWhereWithAggregatesInput | OrdenAnalisisScalarWhereWithAggregatesInput[]
    OR?: OrdenAnalisisScalarWhereWithAggregatesInput[]
    NOT?: OrdenAnalisisScalarWhereWithAggregatesInput | OrdenAnalisisScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OrdenAnalisis"> | string
    consultaId?: StringWithAggregatesFilter<"OrdenAnalisis"> | string
    tipoAnalisis?: StringWithAggregatesFilter<"OrdenAnalisis"> | string
    descripcion?: StringNullableWithAggregatesFilter<"OrdenAnalisis"> | string | null
    estado?: StringWithAggregatesFilter<"OrdenAnalisis"> | string
    resultado?: StringNullableWithAggregatesFilter<"OrdenAnalisis"> | string | null
    archivoId?: StringNullableWithAggregatesFilter<"OrdenAnalisis"> | string | null
    creadoEn?: DateTimeWithAggregatesFilter<"OrdenAnalisis"> | Date | string
    actualizadoEn?: DateTimeWithAggregatesFilter<"OrdenAnalisis"> | Date | string
  }

  export type ConsultaCreateInput = {
    id?: string
    pacienteId: string
    medicoId: string
    citaId?: string | null
    estado: string
    motivoConsulta?: string | null
    diagnostico?: string | null
    notas?: string | null
    fechaInicio?: Date | string
    fechaFin?: Date | string | null
    creadoEn?: Date | string
    actualizadoEn?: Date | string
    ordenesAnalisis?: OrdenAnalisisCreateNestedManyWithoutConsultaInput
  }

  export type ConsultaUncheckedCreateInput = {
    id?: string
    pacienteId: string
    medicoId: string
    citaId?: string | null
    estado: string
    motivoConsulta?: string | null
    diagnostico?: string | null
    notas?: string | null
    fechaInicio?: Date | string
    fechaFin?: Date | string | null
    creadoEn?: Date | string
    actualizadoEn?: Date | string
    ordenesAnalisis?: OrdenAnalisisUncheckedCreateNestedManyWithoutConsultaInput
  }

  export type ConsultaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pacienteId?: StringFieldUpdateOperationsInput | string
    medicoId?: StringFieldUpdateOperationsInput | string
    citaId?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    motivoConsulta?: NullableStringFieldUpdateOperationsInput | string | null
    diagnostico?: NullableStringFieldUpdateOperationsInput | string | null
    notas?: NullableStringFieldUpdateOperationsInput | string | null
    fechaInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaFin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    creadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
    ordenesAnalisis?: OrdenAnalisisUpdateManyWithoutConsultaNestedInput
  }

  export type ConsultaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pacienteId?: StringFieldUpdateOperationsInput | string
    medicoId?: StringFieldUpdateOperationsInput | string
    citaId?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    motivoConsulta?: NullableStringFieldUpdateOperationsInput | string | null
    diagnostico?: NullableStringFieldUpdateOperationsInput | string | null
    notas?: NullableStringFieldUpdateOperationsInput | string | null
    fechaInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaFin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    creadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
    ordenesAnalisis?: OrdenAnalisisUncheckedUpdateManyWithoutConsultaNestedInput
  }

  export type ConsultaCreateManyInput = {
    id?: string
    pacienteId: string
    medicoId: string
    citaId?: string | null
    estado: string
    motivoConsulta?: string | null
    diagnostico?: string | null
    notas?: string | null
    fechaInicio?: Date | string
    fechaFin?: Date | string | null
    creadoEn?: Date | string
    actualizadoEn?: Date | string
  }

  export type ConsultaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    pacienteId?: StringFieldUpdateOperationsInput | string
    medicoId?: StringFieldUpdateOperationsInput | string
    citaId?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    motivoConsulta?: NullableStringFieldUpdateOperationsInput | string | null
    diagnostico?: NullableStringFieldUpdateOperationsInput | string | null
    notas?: NullableStringFieldUpdateOperationsInput | string | null
    fechaInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaFin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    creadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsultaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    pacienteId?: StringFieldUpdateOperationsInput | string
    medicoId?: StringFieldUpdateOperationsInput | string
    citaId?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    motivoConsulta?: NullableStringFieldUpdateOperationsInput | string | null
    diagnostico?: NullableStringFieldUpdateOperationsInput | string | null
    notas?: NullableStringFieldUpdateOperationsInput | string | null
    fechaInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaFin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    creadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrdenAnalisisCreateInput = {
    id?: string
    tipoAnalisis: string
    descripcion?: string | null
    estado: string
    resultado?: string | null
    archivoId?: string | null
    creadoEn?: Date | string
    actualizadoEn?: Date | string
    consulta: ConsultaCreateNestedOneWithoutOrdenesAnalisisInput
  }

  export type OrdenAnalisisUncheckedCreateInput = {
    id?: string
    consultaId: string
    tipoAnalisis: string
    descripcion?: string | null
    estado: string
    resultado?: string | null
    archivoId?: string | null
    creadoEn?: Date | string
    actualizadoEn?: Date | string
  }

  export type OrdenAnalisisUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoAnalisis?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    resultado?: NullableStringFieldUpdateOperationsInput | string | null
    archivoId?: NullableStringFieldUpdateOperationsInput | string | null
    creadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
    consulta?: ConsultaUpdateOneRequiredWithoutOrdenesAnalisisNestedInput
  }

  export type OrdenAnalisisUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    consultaId?: StringFieldUpdateOperationsInput | string
    tipoAnalisis?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    resultado?: NullableStringFieldUpdateOperationsInput | string | null
    archivoId?: NullableStringFieldUpdateOperationsInput | string | null
    creadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrdenAnalisisCreateManyInput = {
    id?: string
    consultaId: string
    tipoAnalisis: string
    descripcion?: string | null
    estado: string
    resultado?: string | null
    archivoId?: string | null
    creadoEn?: Date | string
    actualizadoEn?: Date | string
  }

  export type OrdenAnalisisUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoAnalisis?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    resultado?: NullableStringFieldUpdateOperationsInput | string | null
    archivoId?: NullableStringFieldUpdateOperationsInput | string | null
    creadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrdenAnalisisUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    consultaId?: StringFieldUpdateOperationsInput | string
    tipoAnalisis?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    resultado?: NullableStringFieldUpdateOperationsInput | string | null
    archivoId?: NullableStringFieldUpdateOperationsInput | string | null
    creadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type OrdenAnalisisListRelationFilter = {
    every?: OrdenAnalisisWhereInput
    some?: OrdenAnalisisWhereInput
    none?: OrdenAnalisisWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type OrdenAnalisisOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConsultaCountOrderByAggregateInput = {
    id?: SortOrder
    pacienteId?: SortOrder
    medicoId?: SortOrder
    citaId?: SortOrder
    estado?: SortOrder
    motivoConsulta?: SortOrder
    diagnostico?: SortOrder
    notas?: SortOrder
    fechaInicio?: SortOrder
    fechaFin?: SortOrder
    creadoEn?: SortOrder
    actualizadoEn?: SortOrder
  }

  export type ConsultaMaxOrderByAggregateInput = {
    id?: SortOrder
    pacienteId?: SortOrder
    medicoId?: SortOrder
    citaId?: SortOrder
    estado?: SortOrder
    motivoConsulta?: SortOrder
    diagnostico?: SortOrder
    notas?: SortOrder
    fechaInicio?: SortOrder
    fechaFin?: SortOrder
    creadoEn?: SortOrder
    actualizadoEn?: SortOrder
  }

  export type ConsultaMinOrderByAggregateInput = {
    id?: SortOrder
    pacienteId?: SortOrder
    medicoId?: SortOrder
    citaId?: SortOrder
    estado?: SortOrder
    motivoConsulta?: SortOrder
    diagnostico?: SortOrder
    notas?: SortOrder
    fechaInicio?: SortOrder
    fechaFin?: SortOrder
    creadoEn?: SortOrder
    actualizadoEn?: SortOrder
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

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ConsultaRelationFilter = {
    is?: ConsultaWhereInput
    isNot?: ConsultaWhereInput
  }

  export type OrdenAnalisisCountOrderByAggregateInput = {
    id?: SortOrder
    consultaId?: SortOrder
    tipoAnalisis?: SortOrder
    descripcion?: SortOrder
    estado?: SortOrder
    resultado?: SortOrder
    archivoId?: SortOrder
    creadoEn?: SortOrder
    actualizadoEn?: SortOrder
  }

  export type OrdenAnalisisMaxOrderByAggregateInput = {
    id?: SortOrder
    consultaId?: SortOrder
    tipoAnalisis?: SortOrder
    descripcion?: SortOrder
    estado?: SortOrder
    resultado?: SortOrder
    archivoId?: SortOrder
    creadoEn?: SortOrder
    actualizadoEn?: SortOrder
  }

  export type OrdenAnalisisMinOrderByAggregateInput = {
    id?: SortOrder
    consultaId?: SortOrder
    tipoAnalisis?: SortOrder
    descripcion?: SortOrder
    estado?: SortOrder
    resultado?: SortOrder
    archivoId?: SortOrder
    creadoEn?: SortOrder
    actualizadoEn?: SortOrder
  }

  export type OrdenAnalisisCreateNestedManyWithoutConsultaInput = {
    create?: XOR<OrdenAnalisisCreateWithoutConsultaInput, OrdenAnalisisUncheckedCreateWithoutConsultaInput> | OrdenAnalisisCreateWithoutConsultaInput[] | OrdenAnalisisUncheckedCreateWithoutConsultaInput[]
    connectOrCreate?: OrdenAnalisisCreateOrConnectWithoutConsultaInput | OrdenAnalisisCreateOrConnectWithoutConsultaInput[]
    createMany?: OrdenAnalisisCreateManyConsultaInputEnvelope
    connect?: OrdenAnalisisWhereUniqueInput | OrdenAnalisisWhereUniqueInput[]
  }

  export type OrdenAnalisisUncheckedCreateNestedManyWithoutConsultaInput = {
    create?: XOR<OrdenAnalisisCreateWithoutConsultaInput, OrdenAnalisisUncheckedCreateWithoutConsultaInput> | OrdenAnalisisCreateWithoutConsultaInput[] | OrdenAnalisisUncheckedCreateWithoutConsultaInput[]
    connectOrCreate?: OrdenAnalisisCreateOrConnectWithoutConsultaInput | OrdenAnalisisCreateOrConnectWithoutConsultaInput[]
    createMany?: OrdenAnalisisCreateManyConsultaInputEnvelope
    connect?: OrdenAnalisisWhereUniqueInput | OrdenAnalisisWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type OrdenAnalisisUpdateManyWithoutConsultaNestedInput = {
    create?: XOR<OrdenAnalisisCreateWithoutConsultaInput, OrdenAnalisisUncheckedCreateWithoutConsultaInput> | OrdenAnalisisCreateWithoutConsultaInput[] | OrdenAnalisisUncheckedCreateWithoutConsultaInput[]
    connectOrCreate?: OrdenAnalisisCreateOrConnectWithoutConsultaInput | OrdenAnalisisCreateOrConnectWithoutConsultaInput[]
    upsert?: OrdenAnalisisUpsertWithWhereUniqueWithoutConsultaInput | OrdenAnalisisUpsertWithWhereUniqueWithoutConsultaInput[]
    createMany?: OrdenAnalisisCreateManyConsultaInputEnvelope
    set?: OrdenAnalisisWhereUniqueInput | OrdenAnalisisWhereUniqueInput[]
    disconnect?: OrdenAnalisisWhereUniqueInput | OrdenAnalisisWhereUniqueInput[]
    delete?: OrdenAnalisisWhereUniqueInput | OrdenAnalisisWhereUniqueInput[]
    connect?: OrdenAnalisisWhereUniqueInput | OrdenAnalisisWhereUniqueInput[]
    update?: OrdenAnalisisUpdateWithWhereUniqueWithoutConsultaInput | OrdenAnalisisUpdateWithWhereUniqueWithoutConsultaInput[]
    updateMany?: OrdenAnalisisUpdateManyWithWhereWithoutConsultaInput | OrdenAnalisisUpdateManyWithWhereWithoutConsultaInput[]
    deleteMany?: OrdenAnalisisScalarWhereInput | OrdenAnalisisScalarWhereInput[]
  }

  export type OrdenAnalisisUncheckedUpdateManyWithoutConsultaNestedInput = {
    create?: XOR<OrdenAnalisisCreateWithoutConsultaInput, OrdenAnalisisUncheckedCreateWithoutConsultaInput> | OrdenAnalisisCreateWithoutConsultaInput[] | OrdenAnalisisUncheckedCreateWithoutConsultaInput[]
    connectOrCreate?: OrdenAnalisisCreateOrConnectWithoutConsultaInput | OrdenAnalisisCreateOrConnectWithoutConsultaInput[]
    upsert?: OrdenAnalisisUpsertWithWhereUniqueWithoutConsultaInput | OrdenAnalisisUpsertWithWhereUniqueWithoutConsultaInput[]
    createMany?: OrdenAnalisisCreateManyConsultaInputEnvelope
    set?: OrdenAnalisisWhereUniqueInput | OrdenAnalisisWhereUniqueInput[]
    disconnect?: OrdenAnalisisWhereUniqueInput | OrdenAnalisisWhereUniqueInput[]
    delete?: OrdenAnalisisWhereUniqueInput | OrdenAnalisisWhereUniqueInput[]
    connect?: OrdenAnalisisWhereUniqueInput | OrdenAnalisisWhereUniqueInput[]
    update?: OrdenAnalisisUpdateWithWhereUniqueWithoutConsultaInput | OrdenAnalisisUpdateWithWhereUniqueWithoutConsultaInput[]
    updateMany?: OrdenAnalisisUpdateManyWithWhereWithoutConsultaInput | OrdenAnalisisUpdateManyWithWhereWithoutConsultaInput[]
    deleteMany?: OrdenAnalisisScalarWhereInput | OrdenAnalisisScalarWhereInput[]
  }

  export type ConsultaCreateNestedOneWithoutOrdenesAnalisisInput = {
    create?: XOR<ConsultaCreateWithoutOrdenesAnalisisInput, ConsultaUncheckedCreateWithoutOrdenesAnalisisInput>
    connectOrCreate?: ConsultaCreateOrConnectWithoutOrdenesAnalisisInput
    connect?: ConsultaWhereUniqueInput
  }

  export type ConsultaUpdateOneRequiredWithoutOrdenesAnalisisNestedInput = {
    create?: XOR<ConsultaCreateWithoutOrdenesAnalisisInput, ConsultaUncheckedCreateWithoutOrdenesAnalisisInput>
    connectOrCreate?: ConsultaCreateOrConnectWithoutOrdenesAnalisisInput
    upsert?: ConsultaUpsertWithoutOrdenesAnalisisInput
    connect?: ConsultaWhereUniqueInput
    update?: XOR<XOR<ConsultaUpdateToOneWithWhereWithoutOrdenesAnalisisInput, ConsultaUpdateWithoutOrdenesAnalisisInput>, ConsultaUncheckedUpdateWithoutOrdenesAnalisisInput>
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

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
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

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type OrdenAnalisisCreateWithoutConsultaInput = {
    id?: string
    tipoAnalisis: string
    descripcion?: string | null
    estado: string
    resultado?: string | null
    archivoId?: string | null
    creadoEn?: Date | string
    actualizadoEn?: Date | string
  }

  export type OrdenAnalisisUncheckedCreateWithoutConsultaInput = {
    id?: string
    tipoAnalisis: string
    descripcion?: string | null
    estado: string
    resultado?: string | null
    archivoId?: string | null
    creadoEn?: Date | string
    actualizadoEn?: Date | string
  }

  export type OrdenAnalisisCreateOrConnectWithoutConsultaInput = {
    where: OrdenAnalisisWhereUniqueInput
    create: XOR<OrdenAnalisisCreateWithoutConsultaInput, OrdenAnalisisUncheckedCreateWithoutConsultaInput>
  }

  export type OrdenAnalisisCreateManyConsultaInputEnvelope = {
    data: OrdenAnalisisCreateManyConsultaInput | OrdenAnalisisCreateManyConsultaInput[]
    skipDuplicates?: boolean
  }

  export type OrdenAnalisisUpsertWithWhereUniqueWithoutConsultaInput = {
    where: OrdenAnalisisWhereUniqueInput
    update: XOR<OrdenAnalisisUpdateWithoutConsultaInput, OrdenAnalisisUncheckedUpdateWithoutConsultaInput>
    create: XOR<OrdenAnalisisCreateWithoutConsultaInput, OrdenAnalisisUncheckedCreateWithoutConsultaInput>
  }

  export type OrdenAnalisisUpdateWithWhereUniqueWithoutConsultaInput = {
    where: OrdenAnalisisWhereUniqueInput
    data: XOR<OrdenAnalisisUpdateWithoutConsultaInput, OrdenAnalisisUncheckedUpdateWithoutConsultaInput>
  }

  export type OrdenAnalisisUpdateManyWithWhereWithoutConsultaInput = {
    where: OrdenAnalisisScalarWhereInput
    data: XOR<OrdenAnalisisUpdateManyMutationInput, OrdenAnalisisUncheckedUpdateManyWithoutConsultaInput>
  }

  export type OrdenAnalisisScalarWhereInput = {
    AND?: OrdenAnalisisScalarWhereInput | OrdenAnalisisScalarWhereInput[]
    OR?: OrdenAnalisisScalarWhereInput[]
    NOT?: OrdenAnalisisScalarWhereInput | OrdenAnalisisScalarWhereInput[]
    id?: StringFilter<"OrdenAnalisis"> | string
    consultaId?: StringFilter<"OrdenAnalisis"> | string
    tipoAnalisis?: StringFilter<"OrdenAnalisis"> | string
    descripcion?: StringNullableFilter<"OrdenAnalisis"> | string | null
    estado?: StringFilter<"OrdenAnalisis"> | string
    resultado?: StringNullableFilter<"OrdenAnalisis"> | string | null
    archivoId?: StringNullableFilter<"OrdenAnalisis"> | string | null
    creadoEn?: DateTimeFilter<"OrdenAnalisis"> | Date | string
    actualizadoEn?: DateTimeFilter<"OrdenAnalisis"> | Date | string
  }

  export type ConsultaCreateWithoutOrdenesAnalisisInput = {
    id?: string
    pacienteId: string
    medicoId: string
    citaId?: string | null
    estado: string
    motivoConsulta?: string | null
    diagnostico?: string | null
    notas?: string | null
    fechaInicio?: Date | string
    fechaFin?: Date | string | null
    creadoEn?: Date | string
    actualizadoEn?: Date | string
  }

  export type ConsultaUncheckedCreateWithoutOrdenesAnalisisInput = {
    id?: string
    pacienteId: string
    medicoId: string
    citaId?: string | null
    estado: string
    motivoConsulta?: string | null
    diagnostico?: string | null
    notas?: string | null
    fechaInicio?: Date | string
    fechaFin?: Date | string | null
    creadoEn?: Date | string
    actualizadoEn?: Date | string
  }

  export type ConsultaCreateOrConnectWithoutOrdenesAnalisisInput = {
    where: ConsultaWhereUniqueInput
    create: XOR<ConsultaCreateWithoutOrdenesAnalisisInput, ConsultaUncheckedCreateWithoutOrdenesAnalisisInput>
  }

  export type ConsultaUpsertWithoutOrdenesAnalisisInput = {
    update: XOR<ConsultaUpdateWithoutOrdenesAnalisisInput, ConsultaUncheckedUpdateWithoutOrdenesAnalisisInput>
    create: XOR<ConsultaCreateWithoutOrdenesAnalisisInput, ConsultaUncheckedCreateWithoutOrdenesAnalisisInput>
    where?: ConsultaWhereInput
  }

  export type ConsultaUpdateToOneWithWhereWithoutOrdenesAnalisisInput = {
    where?: ConsultaWhereInput
    data: XOR<ConsultaUpdateWithoutOrdenesAnalisisInput, ConsultaUncheckedUpdateWithoutOrdenesAnalisisInput>
  }

  export type ConsultaUpdateWithoutOrdenesAnalisisInput = {
    id?: StringFieldUpdateOperationsInput | string
    pacienteId?: StringFieldUpdateOperationsInput | string
    medicoId?: StringFieldUpdateOperationsInput | string
    citaId?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    motivoConsulta?: NullableStringFieldUpdateOperationsInput | string | null
    diagnostico?: NullableStringFieldUpdateOperationsInput | string | null
    notas?: NullableStringFieldUpdateOperationsInput | string | null
    fechaInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaFin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    creadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsultaUncheckedUpdateWithoutOrdenesAnalisisInput = {
    id?: StringFieldUpdateOperationsInput | string
    pacienteId?: StringFieldUpdateOperationsInput | string
    medicoId?: StringFieldUpdateOperationsInput | string
    citaId?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    motivoConsulta?: NullableStringFieldUpdateOperationsInput | string | null
    diagnostico?: NullableStringFieldUpdateOperationsInput | string | null
    notas?: NullableStringFieldUpdateOperationsInput | string | null
    fechaInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaFin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    creadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrdenAnalisisCreateManyConsultaInput = {
    id?: string
    tipoAnalisis: string
    descripcion?: string | null
    estado: string
    resultado?: string | null
    archivoId?: string | null
    creadoEn?: Date | string
    actualizadoEn?: Date | string
  }

  export type OrdenAnalisisUpdateWithoutConsultaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoAnalisis?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    resultado?: NullableStringFieldUpdateOperationsInput | string | null
    archivoId?: NullableStringFieldUpdateOperationsInput | string | null
    creadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrdenAnalisisUncheckedUpdateWithoutConsultaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoAnalisis?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    resultado?: NullableStringFieldUpdateOperationsInput | string | null
    archivoId?: NullableStringFieldUpdateOperationsInput | string | null
    creadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrdenAnalisisUncheckedUpdateManyWithoutConsultaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoAnalisis?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    resultado?: NullableStringFieldUpdateOperationsInput | string | null
    archivoId?: NullableStringFieldUpdateOperationsInput | string | null
    creadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizadoEn?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ConsultaCountOutputTypeDefaultArgs instead
     */
    export type ConsultaCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ConsultaCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ConsultaDefaultArgs instead
     */
    export type ConsultaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ConsultaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OrdenAnalisisDefaultArgs instead
     */
    export type OrdenAnalisisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrdenAnalisisDefaultArgs<ExtArgs>

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