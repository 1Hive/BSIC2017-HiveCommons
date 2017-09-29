import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'
import userReducer from './user/userReducer'
import {beeBalanceReducer, honeyBalanceReducer} from './layouts/faucet/balanceReducer'

const reducer = combineReducers({
    routing: routerReducer,
    user: userReducer,
    beeBalance: beeBalanceReducer,
    honeyBalance: honeyBalanceReducer
})

export default reducer
