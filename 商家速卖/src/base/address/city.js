import address from 'data/areaAddress'
const fs = require('fs')
let reg = /北京|天津|上海|重庆/
let city = []
let province = []
for (const item of address) {
  if (item.parent === '0') {
    if (reg.test(item.name)) {
      city.push(item)
    } else {
      province.push(item)
    }
  }
}
const array = province.map(item => {
  let city = address.filter(citys => {
    return citys.parent === item.value
  })
  item.city = city
  return item
})
fs.writeFile('address.json', JSON.stringify([...city, ...array]), function (err) {
  if (err) throw err
  console.log(6666)
})
