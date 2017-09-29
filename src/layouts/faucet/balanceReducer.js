const initialState = {
  balance: null
}

export const balanceReducer = (state = initialState, action) => {
  if (action.type === "UPDATE_BALANCE") {
    return Object.assign({}, state, {
      balance: action.balance
    })
  }
  return state
}