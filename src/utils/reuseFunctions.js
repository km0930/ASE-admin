import { date, exportFile } from 'quasar'
global.Buffer = global.Buffer || require('buffer').Buffer

const months = { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' }

export const readableDateNow = () => {
  const now = new Date().toLocaleDateString()
  const splitedData = now.split('/')
  const [day, month, year] = [parseInt(splitedData[0]), months[parseInt(splitedData[1])], parseInt(splitedData[2])]
  return `${day} ${month} ${year}` // 1 Jan 2020
}

export const timeSince = (date) => {
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ]
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  const interval = intervals.find((i) => i.seconds < seconds)
  const count = Math.floor(seconds / interval.seconds)
  return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago` // 1 year ago // 2 years ago
}

export const dateFormatReadable = (dateFormate) => {
  const splitedData = dateFormate.split('-')
  const year = parseInt(splitedData[0])
  const month = months[parseInt(splitedData[1])]
  const day = parseInt(splitedData[2])
  let result = ''
  if (day) {
    result = `${day} ${month} ${year}` // 1 Jan 2020
  } else {
    result = `${month} ${year}` // Jan 2020
  }
  return result
}

export const urlSafeBase64Encode = (data) => {
  if (!data) return undefined
  return Buffer.from(data).toString('base64')
}

export const urlSafeBase64Decode = (data) => {
  if (!data) return undefined
  return Buffer.from(data, 'base64').toString()
}

export const convertJsonToFormData = (data) => {
  const formData = new FormData()
  const entries = Object.entries(data)

  for (let i = 0; i < entries.length; i++) {
    const arKey = entries[i][0]
    let arVal = entries[i][1]
    if (typeof arVal === 'boolean') {
      arVal = arVal === true ? 1 : 0
    }
    if (Array.isArray(arVal)) {
      if (this.isFile(arVal[0])) {
        for (let z = 0; z < arVal.length; z++) {
          formData.append(`${arKey}[]`, arVal[z])
        }

        continue
      } else if (arVal[0] instanceof Object) {
        for (let j = 0; j < arVal.length; j++) {
          if (arVal[j] instanceof Object) {
            for (const prop in arVal[j]) {
              if (Object.prototype.hasOwnProperty.call(arVal[j], prop)) {
                if (!isNaN(Date.parse(arVal[j][prop]))) {
                  formData.append(`${arKey}[${j}][${prop}]`, new Date(arVal[j][prop]))
                } else {
                  formData.append(`${arKey}[${j}][${prop}]`, arVal[j][prop])
                }
              }
            }
          }
        }
        continue
      } else {
        arVal = JSON.stringify(arVal)
      }
    }

    if (arVal === null) {
      continue
    }
    formData.append(arKey, arVal)
  }
  return formData
}

export const filteredItemBasedOnKey = (key, totalList) => {
  if (key) {
    const needle = key.toLowerCase()
    const newItem = totalList.filter((v) => v.value.toLowerCase().indexOf(needle) > -1)
    let result = {}
    newItem.map((obj) => (result = { label: obj.label, value: obj.value }))
    if (result.label && result.value) {
      return result // {label: "Afghanistan", value: "AF"}
    } else {
      return null
    }
  } else {
    return null
  }
}

export const todayDate = () => {
  const timeStamp = Date.now()
  return date.formatDate(timeStamp, 'YYYY/MM/DD') // 2023/02/09
}

export const DateValidations = (dateFormate) => {
  const date = dateFormate,
    mnth = ('0' + (date.getMonth() + 1)).slice(-2),
    day = ('0' + date.getDate()).slice(-2)
  return [date.getFullYear(), mnth, day].join('/') // 2022/06/24
}

export const downloadCSV = (columns, rows, title) => {
  const wrapCsvValue = (val) => {
    let formatted = val !== undefined && val !== null ? String(val) : ''
    formatted = formatted.replace(/"/g, '""')
    return `"${formatted}"`
  }

  const content = [columns.map((col) => wrapCsvValue(col.label)).join(',')]
    .concat(
      rows.map((row) =>
        columns.map((col) => wrapCsvValue(typeof col.field === 'function' ? col.field(row) : row[col.field ?? col.name])).join(',')
      )
    )
    .join('\r\n')

  return exportFile(`${title}.csv`, content, 'text/csv')
}

export function getBase64EncodeString(file) {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) return reject('Invalid file')
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result.split('base64,')[1])
    reader.onerror = () => reject('Failed to read')
  })
}

export function generateChangedObject(oldObj, newObj) {
  const changedObj = {}

  function isObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value)
  }

  function isArray(value) {
    return Array.isArray(value)
  }

  function areEqual(val1, val2) {
    if (isArray(val1) && isArray(val2)) {
      if (val1.length !== val2.length) return false
      for (let i = 0; i < val1.length; i++) {
        if (!areEqual(val1[i], val2[i])) return false
      }
      return true
    } else if (isObject(val1) && isObject(val2)) {
      const keys1 = Object.keys(val1)
      const keys2 = Object.keys(val2)
      if (keys1.length !== keys2.length) return false
      for (const key of keys1) {
        if (!areEqual(val1[key], val2[key])) return false
      }
      return true
    } else {
      return val1 === val2
    }
  }

  for (const key in oldObj) {
    if (![oldObj[key], newObj[key]].includes(undefined)) {
      if (!areEqual(oldObj[key], newObj[key])) {
        changedObj[key] = newObj[key]
      }
    }
  }

  return changedObj
}

export async function getFileWithNameFromUrl(url) {
  const splitUrl = url?.split('/')
  const fileName = splitUrl[splitUrl?.length - 1]
  try {
    const response = await fetch(url)
    const data = await response.blob()
    return {
      name: fileName,
      data: new File([data], fileName, {
        type: data.type
      })
    }
  } catch (error) {
    return false
  }
}
