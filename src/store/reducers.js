import { combineReducers } from 'redux'
import user from './modules/user'
import global from './modules/global'

const reducers = combineReducers({
  user,
  global,
})

export default reducers
