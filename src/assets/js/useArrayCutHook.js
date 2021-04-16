// 内容分页
export function useArrayCutHook (initial, options) {
  const arr = initial.reduce((acc, item) => acc.concat(item), [])

  const runtimeOptions = {
    defaultLength: 4,
    additional: 3,
    ...(options || {}),
  }

  function getArr() {
    const { results } = arr.reduce(
      (acc, item, index) => {
        if (index < runtimeOptions.defaultLength) {
          acc.results[0][index] = item
          return acc
        }

        if (index === acc.arrLen) {
          acc.arrLen += runtimeOptions.additional
          acc.results.push([item])

          return acc
        }

        acc.results[acc.results.length - 1].push(item)
        return acc
      }, { arrLen: runtimeOptions.defaultLength, results: [[]] },
    )

    return results
  }

  function setArr(index, newArray) {
    const arrIndex = index === 0
      ? 0
      : runtimeOptions.defaultLength + (index - 1) * runtimeOptions.additional
    const length = index === 0 ? runtimeOptions.defaultLength : runtimeOptions.additional

    arr.splice(arrIndex, length, ...newArray)

    return getArr()
  }

  function updateOptions(opts) {
    Object.assign(runtimeOptions, opts)

    return getArr()
  }

  return {
    setArr,
    getArr,
    updateOptions,
  }
}