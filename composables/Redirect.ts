export const useRedirect = (url: string) => {
  const redirectUrl = url ?? '/404'

  window.location.href = redirectUrl
}

