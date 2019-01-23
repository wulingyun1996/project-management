export function smallPic(imgUrl, width, height) {
  let imgLink = imgUrl.match(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
  if (imgLink === null) {
    return ''
  }
  let imgArr = imgUrl.split(imgLink[0])
  return `${imgArr[0]}.c${width}x${height}${imgLink[0]}`
}

export function timeFormat(value) {
  let todayDate = new Date().getMonth() + 1
  if (Number(todayDate) < 10) {
    todayDate = '0' + todayDate
  }
  let today = new Date().getFullYear() + '-' + todayDate + '-' + new Date().getDate()
  let yesterday = new Date().getFullYear() + '-' + todayDate + '-' + (new Date().getDate() - 1)
  let year = String(value).slice(0, 4)
  let month = String(value).slice(4, 6)
  let day = String(value).slice(6, 8)
  let currentTime = year + '-' + month + '-' + day
  if (currentTime === today) {
    currentTime = '今天'
  }
  if (currentTime === yesterday) {
    currentTime = '昨天'
  }
  return currentTime
}