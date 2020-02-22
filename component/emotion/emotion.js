var util = require('../../utils/util.js');
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [
      [
        { id: 0, name: '微笑' }, { id: 1, name: '撇嘴' }, { id: 2, name: '色' }, { id: 3, name: '发呆' }, { id: 4, name: '得意' }, { id: 5, name: '流泪' }, { id: 6, name: '害羞' }, { id: 7, name: '闭嘴' },
        { id: 8, name: '睡' }, { id: 9, name: '大哭' }, { id: 10, name: '尴尬' }, { id: 11, name: '发怒' }, { id: 12, name: '调皮' }, { id: 13, name: '呲牙' }, { id: 14, name: '惊讶' }, { id: 15, name: '难过' },
        { id: 16, name: '酷' }, { id: 17, name: '冷汗' }, { id: 18, name: '抓狂' }, { id: 19, name: '吐' }, { id: 20, name: '偷笑' }, { id: 21, name: '可爱' }, { id: 22, name: '白眼' }, { id: 23, name: '傲慢' }
      ],
      [
        { id: 24, name: '饥饿' }, { id: 25, name: '困' }, { id: 26, name: '惊恐' }, { id: 27, name: '流汗' }, { id: 28, name: '憨笑' }, { id: 29, name: '大兵' }, { id: 30, name: '奋斗' }, { id: 31, name: '咒骂' },
        { id: 32, name: '疑问' }, { id: 33, name: '嘘' }, { id: 34, name: '晕' }, { id: 35, name: '折磨' }, { id: 36, name: '衰' }, { id: 37, name: '骷髅' }, { id: 38, name: '敲打' }, { id: 39, name: '再见' },
        { id: 40, name: '擦汗' }, { id: 41, name: '抠鼻' }, { id: 42, name: '鼓掌' }, { id: 43, name: '糗大了' }, { id: 44, name: '坏笑' }, { id: 45, name: '左哼哼' }, { id: 46, name: '右哼哼' }, { id: 47, name: '哈欠' }
      ],
      [
        { id: 48, name: '鄙视' }, { id: 49, name: '委屈' }, { id: 50, name: '快哭了' }, { id: 51, name: '阴险' }, { id: 52, name: '亲亲' }, { id: 53, name: '吓' }, { id: 54, name: '可怜' }, { id: 55, name: '菜刀' },
        { id: 56, name: '西瓜' }, { id: 57, name: '啤酒' }, { id: 58, name: '篮球' }, { id: 59, name: '乒乓' }, { id: 60, name: '咖啡' }, { id: 61, name: '饭' }, { id: 62, name: '猪头' }, { id: 63, name: '玫瑰' },
        { id: 64, name: '凋谢' }, { id: 65, name: '示爱' }, { id: 66, name: '爱心' }, { id: 67, name: '心碎' }, { id: 68, name: '蛋糕' }, { id: 69, name: '闪电' }, { id: 70, name: '炸弹' }, { id: 71, name: '刀' }
      ],
      [
        { id: 72, name: '足球' }, { id: 73, name: '瓢虫' }, { id: 74, name: '便便' }, { id: 75, name: '月亮' }, { id: 76, name: '太阳' }, { id: 77, name: '礼物' }, { id: 78, name: '拥抱' }, { id: 79, name: '强' },
        { id: 80, name: '弱' }, { id: 81, name: '握手' }, { id: 82, name: '胜利' }, { id: 83, name: '抱拳' }, { id: 84, name: '勾引' }, { id: 85, name: '拳头' }, { id: 86, name: '差劲' }, { id: 87, name: '爱你' },
        { id: 88, name: 'NO' }, { id: 89, name: 'OK' }, { id: 90, name: '爱情' }, { id: 91, name: '飞吻' }, { id: 92, name: '跳跳' }, { id: 93, name: '发抖' }, { id: 94, name: '怄火' }, { id: 95, name: '转圈' }
      ],
      [
        { id: 96, name: '磕头' }, { id: 97, name: '回头' }, { id: 98, name: '跳绳' }, { id: 99, name: '挥手' }, { id: 100, name: '激动' }, { id: 101, name: '街舞' }, { id: 102, name: '左太极' }, { id: 103, name: '右太极' }
      ]
    ]

  },

  /**
   * 监听数据变化
   */
  observers: {

  },

  /**
   * 组件的生命周期
   */
  lifetimes: {
    created: function () {
      //在组件实例刚刚被创建时执行

    },
    attached: function () {
      // 在组件实例进入页面节点树时执行

    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    }
  },

  /**
   * 组件所在页面的声明周期
   */
  pageLifetimes: {
    show: function () {
      // 页面被展示
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    selectEmotion: function (e) {
      let str = e.currentTarget.dataset.name;
      let emotion = `#${str};`;
      console.log(emotion)
      this.triggerEvent('change', { emotion: emotion });
    }

  }
})
