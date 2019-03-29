import Mock from 'mock2js'
import {merge} from './util'

// 直接在文件内部配置
import './rules/main_model'

// 合并多个配置
import users from './rules/users'
import admins from './rules/admins'

Mock.mockWithRules(merge(users, admins))
