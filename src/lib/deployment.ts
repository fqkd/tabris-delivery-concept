export const APP_BASE_URL = import.meta.env.BASE_URL
export const USE_HASH_ROUTER =
  import.meta.env.VITE_ROUTER_MODE === 'hash'

const stripLeadingSlashes = (value: string) => value.replace(/^\/+/, '')

export const publicAssetUrl = (path: string) =>
  `${APP_BASE_URL}${stripLeadingSlashes(path)}`

export const appHref = (route: string) => {
  const normalizedRoute = route.startsWith('/') ? route : `/${route}`
  return USE_HASH_ROUTER
    ? `${APP_BASE_URL}#${normalizedRoute}`
    : normalizedRoute
}

export const getInitialAppLocation = () => {
  if (!USE_HASH_ROUTER) {
    return {
      pathname: window.location.pathname,
      search: window.location.search,
    }
  }

  const hashLocation = window.location.hash.slice(1) || '/'
  const searchStart = hashLocation.indexOf('?')

  return {
    pathname:
      searchStart >= 0 ? hashLocation.slice(0, searchStart) : hashLocation,
    search: searchStart >= 0 ? hashLocation.slice(searchStart) : '',
  }
}
