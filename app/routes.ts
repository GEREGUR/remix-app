import { form, get, route } from 'remix/routes'

export const routes = route({
  assets: get('/assets/*path'),
  home: '/',
  auth: route({
    login: form('/login'),
    logout: form('/logout'),
    signup: form('/signup'),
  }),
  dashboard: get('/dashboard'),
})
