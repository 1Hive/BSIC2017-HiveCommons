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

      // check for Uniqueness, and set into credentials
      const attestation = credentials.verified.filter(_attestation => "Uniqueness" in _attestation.claim)[0]
      if(attestation){
          credentials.jwt = attestation.jwt
          credentials.isUnique = true
          dispatch(updateBeeClaimable(attestation.jwt))
      }


      // Check out the console to see what data we get from uPort.
      console.log(credentials)
      dispatch(userLoggedIn(credentials))

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
