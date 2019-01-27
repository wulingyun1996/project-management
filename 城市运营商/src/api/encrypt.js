const JSEncrypt = require('jsencrypt')
// 实例化一个JSEncrypt对象
const Jsencrypt = function (str) {
  const encrypt = new JSEncrypt.JSEncrypt()
  encrypt.setPublicKey(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCaZ4nxpng2OxhNti8CzVvv+7np
1673Uc/JTGcOoohozrTjLZ6BLbQg6aNTvCcGLKbIJiYa4Reh9s3SGMu2Qkvx80FP
Ty/X6FVRn0ajUDfOLcCMzq0Y12BNAvRUbzsmlN9PJDdmm0vlyXO56582sIhU/CsW
zMcNXp+4GAdW6/rsyQIDAQAB
-----END PUBLIC KEY-----
`)
  const encryptoPasswd = encrypt.encrypt(str)
  return encryptoPasswd
}
export default Jsencrypt
