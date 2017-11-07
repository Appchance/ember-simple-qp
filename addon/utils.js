const {
  keys
} = Object

export const mapValues = (obj, fn) => {
  let newObj = {}
  keys(obj).forEach(key => newObj[key] = fn(obj[key]))
  return newObj
}

export const mapKeys = (obj, fn) => {
  let newObj = {}
  keys(obj).forEach(key => newObj[fn(key)] = obj[key])
  return newObj
}

export const toPairs = (obj) => keys(obj).map(key => [key, obj[key]])

export const tinyMixin = (key, val) => {
  let obj = {}
  obj[key] = val
  return obj
}

export const ensureControllerExistence = (route) => {
  let controllerName = route.controllerName || route.routeName
  return route.controllerFor(controllerName, true) || route.generateController(controllerName)
}

export const SQP_KEY = '_simpleQueryParams'

