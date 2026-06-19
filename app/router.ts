import { createMiddleware, createRouter, type MiddlewareContext } from 'remix/router'
import { formData } from 'remix/middleware/form-data'
import { staticFiles } from 'remix/middleware/static'

import controller from './actions/controller.tsx'
import loginController from './actions/auth/login/controller.tsx'
import logoutController from './actions/auth/logout/controller.tsx'
import signupController from './actions/auth/signup/controller.tsx'
import { loadAuth } from './middleware/auth.ts'
import { loadDatabase } from './middleware/database.ts'
import { render } from './middleware/render.tsx'
import { loadSession } from './middleware/session.ts'
import { routes } from './routes.ts'

const middleware = createMiddleware(
  staticFiles('./public', { index: false }),
  loadSession(),
  formData(),
  loadDatabase(),
  loadAuth(),
  render(),
)

type AppContext = MiddlewareContext<typeof middleware>

declare module 'remix/router' {
  interface RouterTypes {
    context: AppContext
  }
}

export const router = createRouter<AppContext>({
  middleware,
})

router.map(routes, controller)
router.map(routes.auth.login, loginController)
router.map(routes.auth.logout, logoutController)
router.map(routes.auth.signup, signupController)
