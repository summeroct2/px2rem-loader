const { getOptions } = require('loader-utils')
const css = require('css')

const defaultOpts = {
  base: 75,       // 设计稿宽度的1/10
  suffix: 'rpx',  // 要转换为rem的单位
}

function remParser(astRules, opts) {
  const replacer = (match, pn, offset, str) => {
    const rem = pn / opts.base
    return `${parseFloat(rem.toFixed(5))}rem`
  }

  const suffixRegExp = new RegExp(`(\\d+(\\.\\d+)?)${opts.suffix}`)

  for (let i = 0; i < astRules.length; i++) {
    const rule = astRules[i]

    // 处理 rule 和 at-rule: media,keyframes
    if (rule.type === 'media') {
      remParser(rule.rules, opts)
      continue
    } else if (rule.type === 'keyframes') {
      remParser(rule.keyframes, opts)
      continue
    } else if (rule.type !== 'rule') {
      continue
    }
    
    for (let j = 0; j < rule.declarations.length; j++) {
      const declaration = rule.declarations[j]
      const declarationVal = declaration.value
      if (declaration.type === 'declaration' && declarationVal.indexOf(opts.suffix)) {
        declaration.value = declarationVal.replace(suffixRegExp, replacer)
      }
    }
  }

  return astRules
}

module.exports = function (source, sourceMap) {
  const cssAST = css.parse(source)
  
  const queryOpts = getOptions(this)
  const options = Object.assign({}, defaultOpts, queryOpts)
  
  remParser(cssAST.stylesheet.rules, options)

  return css.stringify(cssAST)
}
