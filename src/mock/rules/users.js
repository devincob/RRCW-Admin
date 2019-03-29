export default {
  // Support type as Object and Array
  'GET /api/users': {users: [1, 2]},
  'POST /api/user/login': (req, res) => {
    let body = JSON.parse(req.body)
    setTimeout(() => {
      if (body.loginName === 'admin' && body.password === '888888') {
        res.send({
          isSuccess: true,
          userInfo: {
            userId: 1,
            signature: '@string(6)',
            authToken: '@string(16)',
            loginName: body.loginName
          }
        })
      } else {
        res.send({
          isSuccess: false,
          message: '账号或密码不正确！'
        })
      }
    }, 1000)
  },
  '/api/users/1': {id: 1},
  '/api/users/2': (req, res) => {
    setTimeout(() => {
      res.send({
        'totalCount|100-1000': 100,
        'list|10-100': [{
          'id|1-100': 100,
          'name': '@cname',
          'slot': '@string',
          register: '@datetime("yyyy-MM-dd A HH:mm:ss")',
          'avatar': '@image(\'200x100\', \'#50B347\', \'#FFF\', \'Mock.js\')',
          'motto': '@paragraph',
          'motto_cn': '@cparagraph',
          'csentence': '@csentence'
        }]
      })
    }, 500)
  },

  'POST /api/users/create': () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('ok 123')
      }, 1000)
    })
  },
  'POST /api/user/changePassword': (req, res) => {
    // const body = JSON.parse(req.body)
    setTimeout(() => {
      if (req.body.password !== 'aaa') {
        res.send({
          isSuccess: false,
          message: '旧密码验证失败'
        })
      } else {
        res.send({
          isSuccess: true,
          body: 'success'
        })
      }
    }, 1000)
  }
}
