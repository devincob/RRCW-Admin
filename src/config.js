/**
 * Created by wdj on 16/5/30.
 * Config
 */

const serverConfig = window.__SERVER_CONFIG__ || {}

function getServerConfig(versionCode, key, defaultValue) {
  let _config = serverConfig && serverConfig[versionCode] ? serverConfig[versionCode] : false
  if (_config) {
    if (_config[key]) return _config[key]
  }
  return defaultValue
}

const config = {
  appMode: process.env.NODE_ENV === 'development' ? 'D' : 'P', // APP 模式. P,T,D
  serverConfigVersion: 1000, // 配置版本
  guideVersionCode: 1, // 引导页版本
  versionCode: 1000, // 版本号,打包时自动配置

  week: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  weekItems: ['日', '一', '二', '三', '四', '五', '六'],
  logoURL: 'http://statics.maosui.com/images/Common/20150420/app_logo_300X300.png',
  errorImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAMAAAC93eDPAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABVQTFRF3Oju////4Ovx4ujs1N/kzMzM7PH0D4bLgwAABDlJREFUeNrsmw1zIyEIhl8F+f8/+fzcTe6SLCJbO73STtLOpPEJICJQUKS4SdAeEbcLNq+O3QiNg/atTVUPtBOhO8I3sMV/vyN+EX4RfiBCj26wHnrGP6pffVHKj1na74Z3NGuhfeK2eH7iLJVj/i2xtDo3AUMEnBI3otsR0NbnsmSTlH+SEISqKu5HaIuXT0yS180rS147JSo/IvHNhmh2zzuAiOryh1BKsT3jTgR04fBSqD5Wr8SMT2DCA5v/FSNQeCvUHcQdoatApHnfX1Z4kkyIyBN6gHb5Eov4w6c/hNG0oVYD9C9C2fkSVCIpuSKcBKwkyAjMvr5Q7JCdQAuQJQcI+CLEmAnCjJB6UygNkXWAMCeUlAxQB+UwK1JtAS8ETmFearD2QShRUQwIQecOagQyIFRTXFJoERIb1RAvqzjKAG0jKGq4XkKphWTyhX50uyAYlaDLYFQvYKsSgjC7IFji0mkJj02Z9wM2IyzYoZyYLlpYsEPghN0ILlqALmV8q4X9CA6b8jtoISItaWG3IcQpNC1EJvJCsG9Kl2Nq9YiAS77ALAveCI+sacEfNQmsCsGesRRv9NECr7iCC4I5OLHmMqNDsKqh1t9cEGKyJS2UoMxONf5oQpCkyOHvdsfiC3t3RDmlNmvBLUAvIcSfghBNNRZnBOtRKW6GMB+VxNsDNGtqbrrouHBGeCEYGVjVLlPXHcXkjHAyBIxqAMOt7lhqh/PJmyjblspCNSLPBgdhnRL0CLUnM+OJzKoKtNoQ9WEicalGUDawtR2D1peZRXDsR4z8TY0Qk/6Nb0KgO1qlUzGylL99+5TTBUhlP8bSNleqobVC7vAFdUmeU7wPIV8MdBXXGR+Lc6/lNilx5QgzDJNawPWxrT4bTAg1TF8wyPREzdyOqN+fTytOHON9CL2Bni7TxdsQWvLyuXks+qEBuxYu+tf3DhUNf+TFovPSpmyZy6UhAG8ExHOK8LJ9zQkPU4e4ITRxuioAogzz9GFAR0NQT95YM9QjnHhm/FJ5oRvjhaortgxFuGXQfb6tjDeS+g4x5prgeK1Nc1cZ4uqXPrepNsMxX2ihPg67fLNu84VMlkpPrOjzIxTdhc75Rk5kbsoId4pzh/xD9A4RGPOV9vUPzxyTwXgOda+1QM/r8+r65yb9kErhdXZWZ5qDnwh3Cpy7/BUCHtan4C1PFG+00PORbH7/9U/vTEfd4Tj5nvZ/ie4S7hSJY279cEo8XZVY7gU4KPjhKMVDCKQvWL9HzuNEH98o1azra5Kzc/IoII3hKZbwpSLgWoNAD5m8MrSzNliAkQxtIBg38PFfJjsI+vWzIqwMkK2ZojZtsDSesGyK3tPGLiW0pjbqqPkuglEcXJqcWpXWstiKIC3N3ucKA8HeivWQdnBvRah51MYNMfxxL0IszpCwE6H6I9NuBGLZigD+I8AAReNrrnG0C48AAAAASUVORK5CYII=',
  taskErrorImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAMAAAC93eDPAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABhQTFRF6urqzc3Nrq6uk5OTTU1NGxsbhISE////uz+IBwAAArRJREFUeNrsmI2SqyAMhZMQ8P3feBN+FKmttKu9O3dOZmpRFD/DSYjS8s+NgAAEIAABCEAAAhCAAAQgAAEIQAACEIAABCAAAQhAAMI3ESSdWKCbEU4JjOFmhDRh/Hw4CWZ53MaqMcZU7+XtcB0ChUdLMZuPKd7wE0Nr2Nit8yKEEJ9Z7q4IxLmhbNZalyGwrlbuXHdSGbEg0BFimkQIMgizOzA+R2Z4UIVZmf0PEcSfcwwDmkdwZcg6dhaB0nsRUcYZnS+zCFympvpDV5EuJgn6FKEM8AJhNxBpw6LU/B+qO9IkAnd+X2emMQ1yjDs5mnHzAy1pFym0BeiEHJk47OQo24Et6o4tbAgFTko85kDWC1OTNCsZIq37WYYVwYLUdosadHkrO8rBWiEc5oOSmz44rDOVT+RJhOBPOeQFfi3HY4ReC+95oaw0EjoPnEXEMUK5d8gpSjOQvoPgvZbZZQvlHmFcnFK3XPUIvRbkKI2eIIyPtiFwfGHSaYFk0wLVznkEWjuJRwTSJ8uUG60Ior0W+uJhDsEEaZneqpCWLj/VQuKihePEcIKw2scIGli0amGbni8iZCWnLWkeheWtCPVmpcYrYd0aFyOUcqCLSh+0qmCi+r0CgQ6C8sUypjcgmKd1ZzQm19u9cMurzBUI/JgHf4fwWLjZ+pF/y7Alz6X2R7V85XyEd1dMFW5u+2LBLOxeZTzhJF981LfsGZrEthakFKJVSvWFzosmzTVTu+KytymhXALY4ybbarQgkBTNXz0C+5pQ+tYrrkfQyKkiBF+XaEOwdepLCFab5SlQCu6Q5B53BHeBelVZ+q5GcLVZLcVeG4gXVeR1K+fiNR/IJ5C/2dXD3RV//RPHH/jQgy9uQAACEIAABCAAAQhAAAIQgAAEIAABCEAAAhCAAAQg/GcIPwIMAGfAuDdJeyGQAAAAAElFTkSuQmCC',
  // 活动链接
  /**
   * 图片 Url 前缀
   * @returns {String}
   */
  getImageUrlPath: function () {
    let urls = {
      'D': 'http://static.caiwu.com', // http://192.168.1.130/res/ResReadOlnyServer.ashx
      'T': 'http://test.statics.maosui.com/Res/ResReadOlnyServer.ashx',
      // 'P': getServerConfig(config.serverConfigVersion, 'ImageUrl', 'http://statics.maosui.com/Res/ResReadOlnyServer.ashx')
      'P': 'http://test.static.i-caiwu.com'
    }
    return urls[this.appMode]
  },
  getUploadUrl: function () {
    let urls = {
      'D': location.protocol + '//' + this.getRestfulUrl() + '/User/UploadImage.json',
      'T': 'http://test.global.api.maosui.com/Upload/File.json?ConfigId=common&Key=dfadfasfdasdfe2134sdfsadf',
      'P': getServerConfig(config.serverConfigVersion, 'UploadUrl', 'http://global.api.maosui.com/Upload/File.json?ConfigId=common&Key=dfadfasfdasdfe2134sdfsadf')
    }
    return urls[this.appMode]
  },
  getSiteUrl: function () {
    let urls = {
      'D': 'http://192.168.1.10/MaosuiWebApp/debug.html',
      'T': 'http://test.maosui.com/app_dev/index.html',
      'P': getServerConfig(config.serverConfigVersion, 'SiteUrl', 'http://mc.maosui.com/index.html')
    }
    return urls[this.appMode]
  },
  getRestfulUrl: function () {
    let urls = {
      D: 'api.admin.ts.caiwu.com',
      // D: '127.0.0.1:3001',
      T: 'test.mc.api.maosui.com',
      // P: getServerConfig(config.serverConfigVersion, 'RestfulUrl', 'mc.api.maosui.com')
      P: 'test.api.admin.ts.i-caiwu.com'
    }
    return urls[this.appMode]
  },
  getGSRestfulUrl: function () {
    let urls = {
      D: 'global.api.maosui.com.cn',
      T: 'test.global.api.maosui.com',
      P: getServerConfig(config.serverConfigVersion, 'GSRestfulUrl', 'global.api.maosui.com')
    }
    return urls[this.appMode]
  },
  getShareUrl: function (params) {
    let $ = global.Dom7
    let query = $.serializeObject(params)
    let urls = {
      D: 'http://192.168.1.130/res/WeixinRedirect.ashx',
      // D: 'http://test.statics.maosui.com/res/WeixinRedirect.ashx?UserId=' + userId,
      T: 'http://test.statics.maosui.com/res/WeixinRedirect.ashx',
      P: 'http://statics.maosui.com/res/WeixinRedirect.ashx'
    }
    return urls[this.appMode] + (query ? '?' + query : '')
  },
  getShareProxyUrl: function () {
    let urls = {
      D: 'http://test.activity.maosui.com/Index/shareProxy.html',
      T: 'http://test.activity.maosui.com/Index/shareProxy.html',
      P: 'http://activity.maosui.com/Index/shareProxy.html'
    }
    return urls[this.appMode]
  },
  getUBTServerUrl: function () {
    let urls = {
      D: 'http://192.168.1.10:3399/ubt?app=1',
      T: 'http://192.168.1.10:3399/ubt',
      P: 'http://www.maosui.com:3399/ubt'
    }
    return urls[this.appMode]
  }
}

export default config
