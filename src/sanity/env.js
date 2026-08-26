export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-01'

export const dataset = 'production'

export const projectId = 'x0tpoga9'

// 🔥 Hardcoded to false so Sanity allows file uploads instead of just reading cached data
export const useCdn = false