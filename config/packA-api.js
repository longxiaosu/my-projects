// 本地服务器API地址
// var WxApiRoot = 'http://192.168.31.175:8010/wx/client/';
// var PayApi = 'http://192.168.31.175:8082/eat1bo_system/';

// 线上服务器地址
var WxApiRoot = 'https://www.eat2bo.com/wx/client/';
var PayApi = 'https://www.eat2bo.com/eat1bo_system/';

// 图片压缩的后缀
var indexMini = "?x-oss-process=style/note";
var noteDetail = "?x-oss-process=style/notedetail";

module.exports = {
  coupon: {
    queryTopCoupons: WxApiRoot + "shop/purchaseCoupon/queryTopCoupons", //查询首页福利优惠卷置顶的商品
    loadPurchaseCouponList: WxApiRoot + "shop/purchaseCoupon/queryPurchaseCouponList", //查询福利优惠卷列表
    loadPurchaseCouponDetail: WxApiRoot + "shop/purchaseCoupon/queryPurchaseCouponDetail", //查询福利优惠券详情
    loadRecordShare: WxApiRoot + "shop/purchaseCoupon/recordShare", //查询福利优惠券的shareId
    couponPay: PayApi + "shop/pay/couponPay", //购买福利优惠券,付款
    withdrawMoney: PayApi + "shop/pay/withdrawMoney", //用户金额提现
    loadPurchaseCouponQr: WxApiRoot + "shop/purchaseCoupon/getSharePhoto", //生成分享使用的二维码图
    GetLottery: WxApiRoot + "shop/purchaseCoupon/getLottery", //用户点击抽奖
    loadUserLotteryNum: WxApiRoot + "shop/purchaseCoupon/queryUserLotteryNum",//用户的剩余抽奖次数
    queryExchangeRate: WxApiRoot + "shop/purchaseCoupon/queryExchangeRate"//返回100rmb可以换成的澳门币金额
  },
  goods: {
    queryList: WxApiRoot + "shop/product/queryList", //店铺内的商品列表
    queryDetail: WxApiRoot + "shop/product/queryDetail", //店铺的商品详情
    addCart: WxApiRoot + "shop/product/addCart", //添加商品到购物车
    loadCart: WxApiRoot + "/shop/product/loadCart", //加载购物车
    clearCart: WxApiRoot + "shop/product/clearCart", //删除购物车里面的商品
    createOrder: WxApiRoot + "shop/product/createOrder", //生成订单
    queryOrders: WxApiRoot + "shop/product/queryOrders", //订单列表
    queryOrderDetail: WxApiRoot + "shop/product/queryOrderDetail", //订单详情
    rePay: WxApiRoot + "shop/product/rePay", //订单再次支付
    refund: WxApiRoot + "shop/product/refund" //订单退款
  },
  getPhone: WxApiRoot+ 'getPhone',
  indexMini: indexMini,
  noteDetail: noteDetail
};