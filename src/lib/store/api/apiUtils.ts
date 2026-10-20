export type ApiError = { message: string }

export const toError = (e: { message: string }): ApiError => ({
  message: e.message,
})

export const getErrorMessage = (e: unknown): string | null =>
  e && typeof e === 'object' && 'message' in e
    ? String((e as { message?: string }).message ?? '')
    : null