type SerializableCause = { message: string; name: string } | undefined

export abstract class TaggedError<const Tag extends string> extends Error {
  readonly _tag: Tag
  override readonly cause: SerializableCause

  constructor(tag: Tag, message: string, options: ErrorOptions = {}) {
    super(message, options)
    this.name = this.constructor.name
    this._tag = tag
    this.cause =
      options.cause instanceof Error
        ? { message: options.cause.message, name: options.cause.name }
        : undefined
  }
}
