export const distinct = (array) => {
  const newArray = []
  for (let i = 0; i < array.length; i++) {
    if (array[i]) {
      newArray.push(array[i])
    }
  }
  return [...new Set(newArray)]
}

export const countByProperty = (array, propertyExtractor) => {
  return array.reduce((acc, item) => {
    const prop = propertyExtractor(item)
    const count = acc[`${prop}`] || 0
    acc[`${prop}`] = count + 1
    return acc
  }, {})
}
