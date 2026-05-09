import { createServerFn, createServerOnlyFn } from "@tanstack/react-start"
import { getRequest, setResponseHeader } from "@tanstack/react-start/server"

import { auth } from "./auth"

interface GetUserServerQuery {
  disableCookieCache?: boolean | undefined
  disableRefresh?: boolean | undefined
}

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const user = await getUserServer()
  return user
})

export const getUserServer = createServerOnlyFn(async (query?: GetUserServerQuery) => {
  const session = await auth.api.getSession({
    headers: getRequest().headers,
    query,
    returnHeaders: true,
  })

  const cookies = session.headers?.getSetCookie()
  if (cookies?.length) {
    setResponseHeader("Set-Cookie", cookies)
  }

  return session.response?.user || null
})
