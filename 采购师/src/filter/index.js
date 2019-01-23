import { splitMoney, retainTwoDecimal, sliceChar } from 'common'
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
