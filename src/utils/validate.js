export function isAbsolutePath(path) {
  return /^(https?|tel|mailto)/.test(path);
}
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}
