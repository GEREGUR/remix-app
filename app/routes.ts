import { form, get, route } from 'remix/routes'

export const routes = route({
  assets: get('/assets/*path'),
  home: '/',
  auth: route({
    signup: form('/signup'),
  }),
})
