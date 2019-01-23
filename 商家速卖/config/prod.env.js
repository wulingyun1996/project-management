'use strict'
const { appVersion } = require('../package.json')
const assetsSubDirectory = 'static'
const ISTEST = process.argv[2] === 'test'
const ENV = process.argv[2]
const ISSETVERSION = process.argv[3]
const API_BASE = ISTEST ? '"//test-sapi.cgs18.com/"' : process.argv[2] === 'pre' ? '"//pre-sapi.cgs18.com/"' : '"//sapi.cgs18.com/"'
const defaultAssetsSubDirectory = ISTEST ? (ISTEST && !!ISSETVERSION ? appVersion : assetsSubDirectory) : (!!ENV ? appVersion : assetsSubDirectory)
const VERSION = defaultAssetsSubDirectory
module.exports = {
  NODE_ENV: '"production"',
  API_ROOT: API_BASE,
  IS_TEST_ENV: JSON.stringify(ISTEST),
  defaultAssetsSubDirectory: JSON.stringify(defaultAssetsSubDirectory),
  VERSION: `"${VERSION}"`
}
