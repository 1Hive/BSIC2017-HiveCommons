import { uport } from './../../../util/connectors.js'
import { browserHistory } from 'react-router'
import * as Utils from "../../../../utils/Utils";
import {updateBeeClaimable} from "../../../layouts/faucet/faucetActions";

export const USER_LOGGED_IN = 'USER_LOGGED_IN'
function userLoggedIn(user) {
  return {
    type: USER_LOGGED_IN,
    payload: user
  }
}

export function loginUser() {
  return function(dispatch) {
    // UPort and its web3 instance are defined in ./../../../util/wrappers.
    // Request uPort persona of account passed via QR
    uport.requestCredentials({
      requested: ['name', 'avatar', 'phone', 'country'],
      notifications: true, // We want this if we want to recieve credentials
      verified: ["Uniqueness"] // We need the JWT field from the object specified here to claim Bee.
    }).then((credentials) => {

      // Check out the console to see what data we get from uPort. We need to save it somewhere for use when we want to claim Bee.
      console.log(credentials)

      dispatch(userLoggedIn(credentials))

      const jwt = Utils.getJwtForAttestation(credentials.verified, "Uniqueness")
      dispatch(updateBeeClaimable(jwt))

      // Used a manual redirect here as opposed to a wrapper.
      // This way, once logged in a user can still access the home page.
      var currentLocation = browserHistory.getCurrentLocation()

      if ('redirect' in currentLocation.query)
      {
        return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
      }

      console.log("requestCredentials")

      return
    })
  }
}
