import NProgress from 'nprogress'
import type { UserModule } from '~/types'

export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach(() => { NProgress.start() })
    router.afterEach(() => { NProgress.done() })
    router.afterEach(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      })
    })
  }
}
