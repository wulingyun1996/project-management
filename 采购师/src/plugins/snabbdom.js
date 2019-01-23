import { toRawType, splitMoney, retainTwoDecimal } from 'common'
import { themeBackgroundData } from 'data/backgroundData'
const snabbdom = require('snabbdom')
export const patch = snabbdom.init([
  require('snabbdom/modules/class').default,
  require('snabbdom/modules/dataset').default,
  require('snabbdom/modules/props').default,
  require('snabbdom/modules/style').default,
  require('snabbdom/modules/eventlisteners').default
])
export const h = require('snabbdom/h').default

/**
 * @return {VNode} 只会返回 vnode，并不派发
 * @param {String} selector 虚拟 dom 的选择器 ---> div#market-annnoucement
 * @param {Array} data 原生或者后台返回的 json 格式数据，用于生成 vnode
 * @param {String} activityTheme 活动主题的背景以及字体颜色数据源
 * @param {Function} goodsEvent 商品项的事件源，用于获取商品 id
 * @param {Function} activityEvent 活动项的事件源，用于获取活动 id
 */
export function createVnode (selector, data, activityTheme, goodsEvent, activityEvent) {
  if (toRawType(data) !== 'Array') {
    throw new TypeError(`data must be Array`)
  }
  if (toRawType(activityTheme) !== 'String') {
    throw new TypeError(`activityTheme must be a String`)
  }
  let background = activityTheme
  let color = themeBackgroundData[activityTheme]
  let vnodeList = []
  data.forEach(nodeItem => {
    let vnode
    let { type, content } = nodeItem
    switch (type) {
      case 'text':
        let textVNode = []
        textVNode = content.split('').map(textVNodeItem => {
          if (textVNodeItem === '\n') {
            return h('br')
          }
          return textVNodeItem
        })
        vnode = h(
          `p.cgs-market-description`,
          {
            style: { color }
          },
          textVNode
        )
        break
      case 'image':
        // let { width, height } = nodeItem.extend
        vnode = h(
          'div.cgs-market-picture',
          // { props: { width, height } },
          [
            h('img', { props: { src: content } })
          ]
        )
        break
      case 'goods':
        let goodsLength = content.length
        if (goodsLength) {
          let childVNode = []
          content.forEach(goodsItem => {
            let goodsItemVnode
            // eslint-disable-next-line
            let { id, image_path, title, purchase_price, commission, isflash, isHot, is_stock_good, boutique, material } = goodsItem
            let { init, zero } = splitMoney(purchase_price)
            goodsItemVnode = h(
              'div.goods-item',
              { dataset: { id } },
              [
                isflash ? h('span.flash-icon', { dataset: { id } }) : null,
                isflash ? h('span.flash-line', { dataset: { id } }) : null,
                isHot ? h('span.hot-icon', { dataset: { id } }) : null,
                isHot ? h('div.hot-line', { dataset: { id } }) : null,
                h('img', { props: { src: image_path }, dataset: { id } }),
                h(
                  'div.goods-detail',
                  { dataset: { id } },
                  [
                    h(
                      'h1.goods-title',
                      { dataset: { id } },
                      [
                        // eslint-disable-next-line
                        // is_stock_good ? h('span.goods-icon', { dataset: { id } }, '现货') : null,
                        // isflash ? h('span.flash-icon', { dataset: { id } }, '【限时购】') : null,
                        // isHot ? h('span.hot-icon', { dataset: { id } }, '【爆款】') : null,
                        h('span.txt', { dataset: { id } }, title)
                      ]
                    ),
                    h(
                      'div.goods-info-code',
                      { dataset: { id } },
                      [
                        // eslint-disable-next-line
                        is_stock_good === 1 ? h('div.info-left', { dataset: { id } }, '现货') : null,
                        boutique === 1 ? h('div.info-center', { dataset: { id } }, '精品馆') : null,
                        material === 1 ? h('div.info-right', { dataset: { id } }, '材料馆') : null
                      ]
                    ),
                    h(
                      'div.goods-price',
                      { dataset: { id } },
                      [
                        h(
                          'div.sale-price',
                          { dataset: { id } },
                          [
                            h('span', { dataset: { id } }, '￥'),
                            h('span.price', { dataset: { id } }, init),
                            h('span', { dataset: { id } }, `.${zero}`)
                          ]
                        ),
                        !isflash ? h(
                          'div.goods-commission',
                          { dataset: { id } },
                          [
                            h('i', { dataset: { id } }),
                            h('span', { dataset: { id } }, `￥${retainTwoDecimal(commission)}`)
                          ]
                        ) : null
                      ]
                    )
                  ]
                )
              ]
            )
            childVNode.push(goodsItemVnode)
          })
          vnode = goodsEvent ? h('div.cgs-market-goods-container', { on: { click: goodsEvent } }, childVNode) : h('div.cgs-market-goods-container', childVNode)
        }
        break
      case 'activity':
        // eslint-disable-next-line
        let { id, image_path, title, start_at, end_at, cost } = content
        let activityChildVNode
        activityChildVNode = h(
          'div.cgs-market-activity',
          { dataset: { id } },
          [
            h('img', { props: { src: image_path }, dataset: { id } }),
            h(
              'div.activity-description',
              { dataset: { id } },
              [
                h('h2.activity-title', { dataset: { id } }, title),
                h(
                  'div.activity-detail',
                  { dataset: { id } },
                  [
                    h(
                      'p',
                      { dataset: { id } },
                      [
                        h('i', { dataset: { id } }),
                        // eslint-disable-next-line
                        h('span', { dataset: { id } }, `${start_at.substr(5, 11)} 至 ${end_at.substr(5, 11)}`)
                      ]
                    ),
                    cost === '免费' ? h('span.activity-flag', { dataset: { id } }, cost) : h('span.activity-flag', { dataset: { id } }, `￥${retainTwoDecimal(cost)}`)
                  ]
                )
              ]
            )
          ]
        )
        vnode = activityEvent ? h('div.cgs-market-activity-container', { on: { click: activityEvent } }, activityChildVNode) : h('div.cgs-market-activity-container', activityChildVNode)
        break
    }
    vnodeList.push(vnode)
  })
  return h(
    selector,
    {
      style: { background }
    },
    vnodeList
  )
}

/**
 * 首页 banner 图数据渲染
 */
export function createBannerVnode (selector, data, goodsEvent, shopEvent) {
  return h('h1', 'shshahahh')
}
