import React, {Component} from 'react'
import {Link} from 'react-router'

class Faucet extends Component {
  constructor(props, {authData}) {
    super(props)
    authData = this.props
  }

  render() {
    return (
      <main className = "container">
        <div className = "pure-g">
          <div className = "pure-u-1-1">
            <h1> Faucet - {this.props.params.name}</h1>
            <button className="pure-button button-xlarge">Get Tokens</button>
          </div>
        </div>
     </main>
    )
  }
}

export default Faucet
