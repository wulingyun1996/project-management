import { splitMoney, retainTwoDecimal, sliceChar } from 'commons'
export default {
  retainTwoDecimal,
  sliceChar,
  getPriceInt (p) {
    return splitMoney(p).init
  },
  getPriceZero (p) {
    return splitMoney(p).zero
  }
}
