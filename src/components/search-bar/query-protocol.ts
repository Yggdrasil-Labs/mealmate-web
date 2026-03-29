export function buildRouteQueryKey(routeKey: string, field: string) {
  return routeKey ? `${routeKey}.${field}` : field
}

export function stripRouteQueryNamespace(
  routeKey: string,
  query: Record<string, unknown>,
) {
  if (!routeKey)
    return query

  const prefix = `${routeKey}.`
  return Object.fromEntries(
    Object.entries(query)
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, value]) => [key.slice(prefix.length), value]),
  )
}
