import { TaggedError } from "./tagged-error"

export class DbEntityNotFoundError extends TaggedError<"DbEntityNotFoundError"> {
  readonly id: string
  readonly entityType: string

  constructor(id: string, entityType: string, options: ErrorOptions = {}) {
    super("DbEntityNotFoundError", `${entityType} not found: ${id}`, options)
    this.id = id
    this.entityType = entityType
  }
}

export class DbInvalidArgumentError extends TaggedError<"DbInvalidArgumentError"> {
  readonly argument: string

  constructor(argument: string, message: string, options: ErrorOptions = {}) {
    super("DbInvalidArgumentError", message, options)
    this.argument = argument
  }
}

export class DbInternalError extends TaggedError<"DbInternalError"> {
  readonly operation: string

  constructor(operation: string, options: ErrorOptions = {}) {
    super("DbInternalError", `Internal error in ${operation}`, options)
    this.operation = operation
  }
}

export type DbError = DbEntityNotFoundError | DbInvalidArgumentError | DbInternalError
