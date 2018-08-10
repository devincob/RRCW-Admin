import Mock from 'mock2js'

export const merge = (...args) => {
  let d = {}
  args && args.length && args.forEach(arg => {
    Object.keys(arg).forEach(key => {
      d[key] = arg[key]
    })
  })
  return d
}

const delayReg = /\sdelay:(\d+)/

export const bindModel = (rules) => {
  Object.keys(rules).forEach(key => {
    let delay = 0
    if (key.indexOf('delay') !== -1) {
      delay = key.match(delayReg)
      let tmp = rules[key]
      delete rules[key]
      key = key.replace(delayReg, '')
      rules[key] = tmp
      if (delay && delay.length > 1) delay = Number(delay[1])
    }
    if (typeof rules[key] === 'function') {
      let fn = rules[key]
      // fn
      rules[key] = (req, res) => {
        if (req.body[0] === '{') {
          let val = JSON.parse(req.body)
          req.method = req.type
          req.params = val
          if (val.body && val.header) {
            req.body = val.body
            req.header = val.header
          }
        }
        try {
          const send = res.send
          res.send = (data) => {
            if (typeof data !== 'object' || !('isSuccess' in data)) {
              data = {
                body: data,
                isSuccess: true
              }
            }
            delay ? setTimeout(() => send(data), delay) : send(data)
          }
          let data = fn(req, res)
          if (!data) return data
          if (data && 'then' in data) {
            return new Promise((resolve) => {
              const _exec = (fn) => {
                data.then(body => {
                  fn((typeof body !== 'object' || !('isSuccess' in body)) ? {
                    body: Mock.mock(body),
                    isSuccess: true
                  } : body)
                }).catch(e => {
                  fn({
                    body: null,
                    message: e.message,
                    isSuccess: false
                  })
                })
              }
              delay ? setTimeout(() => _exec(resolve), delay) : _exec(resolve)
            })
          }
          if (typeof data !== 'object' || !('isSuccess' in data)) {
            data = {
              body: data,
              isSuccess: true
            }
          }
          return delay ? new Promise(resolve => {
            setTimeout(() => resolve(data), delay)
          }) : data
        } catch (e) {
          return {
            isSuccess: false,
            message: e.message,
            body: null
          }
        }
      }
      // fn end
    } else {
      const data = rules[key]
      if (typeof data !== 'object' || !('isSuccess' in data)) {
        rules[key] = {
          body: data,
          isSuccess: true
        }
      }
      const _data = rules[key]
      rules[key] = delay ? (req, res) => {
        setTimeout(() => {
          res.send(_data)
        }, delay)
      } : _data
    }
  })
  return rules
}
