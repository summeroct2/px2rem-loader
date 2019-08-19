const loaderUtils = require('loader-utils')
const css = require('css')

module.exports = function (source, sourceMap) {
  const cssAST = css.parse(source)
  const defaultOpts = {
    base: 75,
    suffix: 'rpx',
  }
  const loaderOpts = !!this.query ? loaderUtils.parseQuery(this.query) : {}

  const options = Object.assign({}, defaultOpts, loaderOpts)
  const regexp = new RegExp(`(\\d+(\\.\\d+)?)${options.suffix}`, 'g')

  const replacer = (match, pn, offset, str) => {
    // pn: rpx => rem
    const rem = pn / options.base
    return `${parseFloat(rem.toFixed(5))}rem`
  }

  console.log('css AST', JSON.stringify(cssAST))
  // {
  //   "type": "stylesheet",
  //   "stylesheet":{"rules":[{"type":"rule","selectors":[".hellorpx"],"declarations":[{"type":"declaration","property":"width","value":"300rpx","position":{"start":{"line":2,"column":3},"end":{"line":2,"column":16}}},{"type":"declaration","property":"height","value":"800rpx","position":{"start":{"line":3,"column":3},"end":{"line":3,"column":17}}},{"type":"declaration","property":"font-size","value":"14px","position":{"start":{"line":4,"column":3},"end":{"line":4,"column":18}}}],"position":{"start":{"line":1,"column":1},"end":{"line":4,"column":21}}},{"type":"rule","selectors":[".hellorpx .gogo"],"declarations":[{"type":"declaration","property":"padding-top","value":"30rpx","position":{"start":{"line":6,"column":5},"end":{"line":6,"column":23}}},{"type":"declaration","property":"padding-bottom","value":"60.5rpx","position":{"start":{"line":7,"column":5},"end":{"line":7,"column":28}}}],"position":{"start":{"line":5,"column":3},"end":{"line":7,"column":31}}}],"parsingErrors":[]}
  // }
  
  source = source.replace(regexp, replacer)
  return source
}
