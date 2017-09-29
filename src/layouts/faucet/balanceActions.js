import * as dependencies from "../../web3/dependencies";

export const UPDATE_BALANCE = 'UPDATE_BALANCE'

export function updatedBalance(balance) {
  return {
    type: UPDATE_BALANCE,
    balance
  }
}

export const updateBalance = () => {
  return dispatch => {
    dependencies.beeTokenBridge.getBeeTokenBalance()
        .subscribe(beeTokenBalance => dispatch(updatedBalance(beeTokenBalance)))
  }
}