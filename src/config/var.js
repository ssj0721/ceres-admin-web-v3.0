export const globalVar = {
  //表单全局控件的大小
  sizeStyle: "small"
}

export default ({ Vue }) => {
  Vue.prototype.$globalVar = globalVar
  //全局表单样式
  Vue.prototype.$AVUE.size = globalVar.sizeStyle;
  Vue.prototype.$ELEMENT.size = globalVar.sizeStyle;
}