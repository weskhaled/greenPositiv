import AOS from 'aos'
import type { UserModule } from '~/types'

export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    router.afterEach(async() => {
      await nextTick()
      AOS.init()
    })
  }
}
