import React, { Component } from 'react'

class Profile extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Profile</h1>
            {/*<img className="profile-logo" src={'https://ipfs.io' + this.props.authData.image.contentUrl}></img>*/}
            <p><strong>Name: </strong>{this.props.authData.name}</p>
            <p><strong>Phone: </strong>{this.props.authData.phone}</p>
            <p><strong>Country: </strong>{this.props.authData.country}</p>
            {/*<hr></hr>*/}
            <p>Change these details in UPort to see them reflected here.</p>
          </div>
        </div>
      </main>
    )
  }
}

export default Profile
