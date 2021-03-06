declare interface codeMessageMapTypes {
  400: string
  401: string
  403: string
  404: string
  405: string
  500: string
  [key: string]: string
}

const codeMessageMap: codeMessageMapTypes = {
  400: '[400]:wrong request parameter',
  401: '[401]:Vous avez été déconnecté',
  403: '[403]:Accés refusé',
  404: '[404]:request path error',
  405: '[405]:request method error',
  500: '[500]:Server Error',
}

const showCodeMessage = (code: number | string): string => {
  return codeMessageMap[JSON.stringify(code)] || 'The network connection is abnormal, please try again later!'
}

export default showCodeMessage
