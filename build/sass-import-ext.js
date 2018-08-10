module.exports = function (source) {
  return source.replace(/@import "pages\/(.*?)";/g, ".x-page-$1{\n@import \"pages/$1\";\n}")
}
