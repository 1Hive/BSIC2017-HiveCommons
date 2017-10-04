import React, { Component } from 'react'

import {generateUniquenessAttestation} from "../../../web3/attestationBridge";

class Profile extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }


  render() {

    const GetAttestationLink = () =>
      <div>
        <p>In order to cliam a BEE token you need to have an attestation that you are unique.</p>
        <p>Once you have received the attestation you must refresh this page and log back in again to be able to claim Bee.</p>
        <button className='pure-button pure-button-primary' onClick={(() => generateUniquenessAttestation(this.props.authData.address))}>attest</button>
      </div>


    const profileUrl = this.props.authData && this.props.authData.image ?
      'https://ipfs.io' + this.props.authData.image.contentUrl :
      'https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg'

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Profile</h1>
            <img className="profile-logo" src={profileUrl}></img>
            <p><strong>Name: </strong>{this.props.authData.name}</p>
            <p><strong>Phone: </strong>{this.props.authData.phone}</p>
            <p><strong>Country: </strong>{this.props.authData.country}</p>
            <p>Change these details in UPort to see them reflected here.</p>
            <hr></hr>

            {this.props.authData.isUnique ?
              null
              :
              <GetAttestationLink/>
            }


          </div>
        </div>
      </main>
    )
  }
}

export default Profile
