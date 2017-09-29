import * as dependencies from "../../web3/dependencies";

export const UPDATE_BEE_BALANCE = 'UPDATE_BEE_BALANCE'
export const UPDATE_HONEY_BALANCE = 'UPDATE_HONEY_BALANCE'

export function updatedBeeBalance(beeBalance) {
    return {
        type: UPDATE_BEE_BALANCE,
        beeBalance
    }
}

export const updateBeeBalance = () => {
    return dispatch => {
        dependencies.beeTokenBridge.getBeeTokenBalance()
            .subscribe(beeTokenBalance => dispatch(updatedBeeBalance(beeTokenBalance)))
    }
}

export function updatedHoneyBalance(honeyBalance) {
    return {
        type: UPDATE_HONEY_BALANCE,
        honeyBalance
    }
}

export const updateHoneyBalance = () => {
    return dispatch => {
        dependencies.honeyTokenBridge.getBalance()
            .subscribe(honeyTokenBalance => dispatch(updatedHoneyBalance(honeyTokenBalance)))
    }
}