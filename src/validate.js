/**
 * @param {string} path
 * @returns {Boolean}
 */
export const validatePopupDir = path => {
  const reg = /^popup(\/[a-zA-z_]{1,})+.(ts|js|jsx|tsx)$/
  return reg.test(path)
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export const validateContentDir = path => {
  const reg = /^content(\/[a-zA-z_]{1,})+.(ts|js|jsx|tsx)$/
  return reg.test(path)
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export const validateBackgroundDir = path => {
  const reg = /^background(\/[a-zA-z_]{1,})+.(ts|js|jsx|tsx)$/
  return reg.test(path)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}
