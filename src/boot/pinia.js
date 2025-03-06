import { boot } from 'quasar/wrappers'
import { createPinia } from 'pinia'

export default boot(async ({ app }) => {
  const pinia = createPinia()
  app.use(pinia)
})
