const state = {
  setSize: [],
  goodInfo: [],
  commodityList: [],
  goodPhoto: [],
  goDownId: '',
  goodShareInfo: [],
  helpId: '',
  addressId: [],
  commodity: '',
  orderState: '',
  orderIndex: '',
  // edit-goods
  modeData: {},
  // 编辑草稿发布的时候，修改商品列表tab数量的标识
  isModifyTabNumber: null,
  recruitScrollY: 0,
  modIndex: 0,
  myIndex: 0,
  submitId: 0,
  currentId: 0,
  orderInfo: {},
  // company: '',
  category: '',
  isEditCate: 0,
  categoryId: '',
  // brandShow: false,
  brandSku: [],
  specSku: [],
  chooseBrand: '',
  skuShow: false,
  isShowRecommend: true, // 联盟活动是否显示推荐来源
  whichActivity: 0, // 联盟活动选择哪一个活动
  allianceList: [],
  allianceName: '', // 联盟商名称
  establishActivity: {}, // 创建联盟活动离开后保存的信息,
  allianceStatisticsDataList: [] // 商圈联盟统计下拉数据
}

export default state
