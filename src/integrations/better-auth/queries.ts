import { queryOptions } from "@tanstack/react-query"

import { getUser } from "./auth.functions"

export const authQueryOptions = () =>
  queryOptions({
    queryKey: ["auth"],
    queryFn: ({ signal }) => getUser({ signal }),
  })

export type AuthQueryResult = Awaited<ReturnType<typeof getUser>>
