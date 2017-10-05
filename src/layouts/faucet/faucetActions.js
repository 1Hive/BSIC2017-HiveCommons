import * as dependencies from "../../web3/dependencies";

// BEE Actions
export const UPDATE_BEE_BALANCE = 'UPDATE_BEE_BALANCE'
export const UPDATE_BEE_CLAIMABLE = 'UPDATE_BEE_CLAIMABLE'

export const updatedBeeBalance = (beeBalance) => {
    return {
        type: UPDATE_BEE_BALANCE,
        beeBalance
    }
}
export const updatedBeeClaimable = (isBeeClaimable) => {
    return {
        type: UPDATE_BEE_CLAIMABLE,
        isBeeClaimable
    }
}


// HNY Actions
export const UPDATE_HONEY_BALANCE = 'UPDATE_HONEY_BALANCE'
export const UPDATE_BEE_AVAILABLE_FOR_CLAIMING = 'UPDATE_BEE_AVAILABLE_FOR_CLAIMING'
export const UPDATE_HONEY_TO_BEE_RATE = 'UPDATE_HONEY_TO_BEE_RATE'
export const UPDATE_HONEY_FAUCET_EXPIRED = 'UPDATE_HONEY_FAUCET_EXPIRED'

export const updatedHoneyBalance = (honeyBalance) => {
    return {
        type: UPDATE_HONEY_BALANCE,
        honeyBalance
    }
}
export const updatedBeeAvailableForClaiming = (beeAvailableForClaiming) => {
    return {
        type: UPDATE_BEE_AVAILABLE_FOR_CLAIMING,
        beeAvailableForClaiming
    }
}
export const updatedHoneyToBeeRate = (honeyToBeeRate) => {
    return {
        type: UPDATE_HONEY_TO_BEE_RATE,
        honeyToBeeRate
    }
}
export const updatedHoneyFaucetExpired = (honeyFaucetExpired) => {
    return {
        type: UPDATE_HONEY_FAUCET_EXPIRED,
        honeyFaucetExpired
    }
}


// --


export const updateBeeBalance = () => {
    return dispatch => {
        dependencies.beeTokenBridge.getBeeTokenBalance()
            .subscribe(beeTokenBalance => dispatch(updatedBeeBalance(beeTokenBalance)))
    }
}

export const updateBeeClaimable = (jwt) => {
    return dispatch => {
        dependencies.beeTokenBridge.canClaimBee(jwt)
            .subscribe(canClaimBee => dispatch(updatedBeeClaimable(canClaimBee)))
    }
}

export const updateBeeAvailableForClaiming = () => {
    return dispatch => {
        dependencies.honeyTokenBridge.beeAvailableInClone()
            .subscribe((beeAvailable => dispatch(updatedBeeAvailableForClaiming(beeAvailable))))
    }
}

export const updateHoneyBalance = () => {
    return dispatch => {
        dependencies.honeyTokenBridge.getBalance()
            .subscribe(honeyTokenBalance => dispatch(updatedHoneyBalance(honeyTokenBalance)))
    }
}

export const updateHoneyToBeeRate = () => {
    return dispatch => {
        dependencies.honeyTokenBridge.getHoneyForBeeRate()
            .subscribe(honeyToBeeRate => dispatch(updatedHoneyToBeeRate(honeyToBeeRate)))
    }
}

export const updateHoneyFaucetExpired = () => {
    return dispatch => {
        dependencies.honeyTokenBridge.isFaucetExpired()
            .subscribe(honeyFaucetExpired => dispatch(updatedHoneyFaucetExpired(honeyFaucetExpired)))
    }
}
