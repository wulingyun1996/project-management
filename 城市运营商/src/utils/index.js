/**
 * 对 element-ui 的 Message 提示消息进行封装
 * @param {String|Number} message        提示消息，禁止传入 html 片段
 * @param {String|Number} themeType      消息类型：success/warning/info/error
 * @param {Number|Boolean} showCloseIcon 是否显示关闭 icon
 * @param {Function} onClose             关闭弹窗时候执行的回调函数，允许在 .vue 文件中指定 methods 中的函数
 */
export function showMessage (message = '', themeType = 1, showCloseIcon = 0, onClose = function () {}) {
  let type, showClose
  switch (themeType) {
    case 1:
      type = 'success'
      break
    case 2:
      type = 'warning'
      break
    case 3:
      type = 'info'
      break
    case 4:
      type = 'error'
      break
  }
  showClose = !!showCloseIcon
  this.$message({
    message,
    type,
    showClose,
    onClose
  })
}

/**
 * 对 element-ui 的 MessageBox 弹窗进行封装，涉及参数较多，需要注意传参顺序，如果满足不了，
 * 在 .vue 文件中单独使用 $msgbox/$alert/$confirm/$prompt 方法
 * @param {String|Number} message             弹窗的主体消息，禁止传入 html 片段
 * @param {String|Number} title               弹窗标题
 * @param {Number|Boolean} messageBoxType     弹窗类型，有四种 $msgbox、$alert、$confirm、$prompt，默认是 $confirm
 * @param {Number|Boolean} isShowCancelButton 是否展示取消按钮，默认：不展示
 * @param {String} confirmButtonText          确定按钮的文本，默认：确定
 * @param {String} cancelButtonText           取消按钮的文本，默认：取消
 * @param {Function} callback                 触发取消或确定功能时候执行的回调函数，允许在 .vue 文件中指定 methods 中的函数
 */
export function showMessageBox (
  message = '',
  title = '',
  messageBoxType = 1,
  isShowCancelButton = 0,
  confirmButtonText = '确定',
  cancelButtonText = '取消',
  callback = function (action) {},
  type = 'warning') {
  let BoxType, showCancelButton
  switch (messageBoxType) {
    case 1:
      BoxType = '$confirm'
      break
    case 2:
      BoxType = '$msgbox'
      break
    case 3:
      BoxType = '$alert'
      break
    case 4:
      BoxType = '$prompt'
      break
  }
  showCancelButton = !!isShowCancelButton
  if (messageBoxType === 2) {
    this[BoxType]({
      message,
      title,
      showCancelButton,
      confirmButtonText,
      cancelButtonText,
      callback,
      type
    })
    return
  }
  if (messageBoxType === 1) {
    showCancelButton = true
  }
  this[BoxType](message, {
    title,
    showCancelButton,
    confirmButtonText,
    cancelButtonText,
    callback,
    type
  })
}
