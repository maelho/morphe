import { prisma } from "#/db"
import type { FormModel } from "#/generated/prisma/models"

import type { CreateFormInput } from "./builder.schemas"
import { DbInternalError, type DbError } from "./errors/db"

type CreateFormResult = { success: true; data: FormModel } | { success: false; error: DbError }

export async function createNewForm({
  name,
  description,
  userId,
}: CreateFormInput & { userId: string }): Promise<CreateFormResult> {
  try {
    const createdForm = await prisma.form.create({
      data: {
        name,
        description,
        userId,
      },
    })

    return { success: true, data: createdForm }
  } catch (cause) {
    return {
      success: false,
      error: new DbInternalError("createNewForm", {
        cause: cause instanceof Error ? cause : new Error("Unknown database error"),
      }),
    }
  }
}
