import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import userReducer from './user/userReducer'
import {balanceReducer} from './layouts/faucet/balanceReducer'

const reducer = combineReducers({
  routing: routerReducer,
  user: userReducer,
  balance: balanceReducer
})

export default reducer
