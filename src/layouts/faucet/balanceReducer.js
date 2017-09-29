import {UPDATE_BEE_BALANCE, UPDATE_HONEY_BALANCE} from "./balanceActions"

const beeInitialState = {
    beeBalance: null
}

export const beeBalanceReducer = (state = beeInitialState, action) => {
    if (action.type === UPDATE_BEE_BALANCE) {
        return Object.assign({}, state, {
            beeBalance: action.beeBalance
        })
    }
    return state
}

const honeyInitialState = {
    honeyBalance: null
}

export const honeyBalanceReducer = (state = honeyInitialState, action) => {
    if (action.type === UPDATE_HONEY_BALANCE) {
        return Object.assign({}, state, {
            honeyBalance: action.honeyBalance
        })
    }
    return state
}