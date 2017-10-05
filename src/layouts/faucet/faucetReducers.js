import {
    UPDATE_BEE_BALANCE, UPDATE_HONEY_BALANCE, UPDATE_BEE_CLAIMABLE, UPDATE_BEE_AVAILABLE_FOR_CLAIMING,
    UPDATE_HONEY_TO_BEE_RATE, UPDATE_HONEY_FAUCET_EXPIRED
} from "./faucetActions"

const beeInitialState = {
    beeBalance: null,
    beeIsClaimable: false
}

export const beeDataReducer = (state = beeInitialState, action) => {
    switch (action.type) {
        case UPDATE_BEE_BALANCE:
            return Object.assign({}, state, {
                beeBalance: action.beeBalance
            })
        case UPDATE_BEE_CLAIMABLE:
            return Object.assign({}, state, {
                beeIsClaimable: action.isBeeClaimable
            })
    }
    return state
}

const honeyInitialState = {
    honeyBalance: null,
    beeAvailableForClaiming: null,
    honeyToBeeRate: null,
    honeyFaucetExpired: null
}

export const honeyDataReducer = (state = honeyInitialState, action) => {
    switch (action.type) {
        case UPDATE_HONEY_BALANCE:
            return Object.assign({}, state, {
                honeyBalance: action.honeyBalance
            })
        case UPDATE_BEE_AVAILABLE_FOR_CLAIMING:
            return Object.assign({}, state, {
                beeAvailableForClaiming: action.beeAvailableForClaiming
            })
        case UPDATE_HONEY_TO_BEE_RATE:
            return Object.assign({}, state, {
                honeyToBeeRate: action.honeyToBeeRate
            })
        case UPDATE_HONEY_FAUCET_EXPIRED:
            return Object.assign({}, state, {
                honeyFaucetExpired: action.honeyFaucetExpired
            })
    }
    return state
}