import React, {Component} from 'react'
import {Link} from 'react-router'

class HoneyFaucet extends Component {
  constructor(props, {authData}) {
    super(props)
    authData = this.props
  }

  render() {
    return (
      <main className = "container">
        <div className = "pure-g">
          <div className = "pure-u-1-1">
            <h1> HNY Faucet </h1>
            <p>Convert BEE tokens to HNY tokens</p>
          </div>
        </div>
     </main>
    )
  }
}

export default HoneyFaucet
