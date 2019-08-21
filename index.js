var loaderUtils = require("loader-utils");

module.exports = function (source, sourceMap) {
  const defOptions = {
    base: 75,
    suffix: 'rpx',
  }
  const loaderOptions = !!this.query ? loaderUtils.parseQuery(this.query) : {}

  const options = Object.assign({}, defOptions, loaderOptions)
  const regexp = new RegExp(`(\\d+(\\.\\d+)?)${options.suffix}`, 'g')

  // 正则查找替换
  // TODO: 将 css 转换为 AST (抽象语法树, Abstract Syntax Tree)，再遍历查找替换
  const replacer = (match, pn, offset, str) => {
    // pn: rpx => rem
    const rem = pn / options.base
    return `${parseFloat(rem.toFixed(5))}rem`
  }

  source = source.replace(regexp, replacer)
  return source
}



