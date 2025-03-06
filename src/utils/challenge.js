export function replaceEmptyString(reference, fields = []) {
  fields.forEach((key) => {
    if (reference[key] === '') {
      reference[key] = undefined
    }
  })
}
