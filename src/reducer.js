import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'
import userReducer from './user/userReducer'
import {beeDataReducer, honeyDataReducer} from './layouts/faucet/faucetReducers'

const reducer = combineReducers({
    routing: routerReducer,
    user: userReducer,
    bee: beeDataReducer,
    honey: honeyDataReducer
})

export default reducer
