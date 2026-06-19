import { createController } from 'remix/router'
import { redirect } from 'remix/response/redirect'
import { Session } from 'remix/session'

import { routes } from '../../../routes.ts'

export default createController(routes.auth.logout, {
  actions: {
    index() {
      return redirect(routes.dashboard.href())
    },
    action(context) {
      let session = context.get(Session)
      session.destroy()
      return redirect(routes.auth.login.index.href(), 303)
    },
  },
})
