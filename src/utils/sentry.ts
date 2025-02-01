import { isDev } from '@/config'
import * as Sentry from '@sentry/react'

export const captureExceptionSentry = (error: any, target: string) => {
  if (!error) {
    console.log(
      '%c captureException called with messing or incorrect arguments',
      'background: #555; color: yellow'
    )
    return
  }
  console.error(`On:${target}/ My Error: ${error} `)
  if (!isDev) {
    Sentry.captureException(error)
  }
}
