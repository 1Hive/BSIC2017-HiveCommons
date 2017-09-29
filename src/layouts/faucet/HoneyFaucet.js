import React, {Component} from 'react'
import {Link} from 'react-router'
import {honeyTokenBridge} from '../../web3/dependencies.js'

class HoneyFaucet extends Component {
  constructor(props, {authData}) {
    super(props)
    authData = this.props
  }

  render() {

    const OnlyGuestLinks = () =>
      <div>
        <button className="pure-button button-xlarge" onClick={() => {

          honeyTokenBridge.getBalance().then(honeyBalance => console.log(honeyBalance.toNumber() / 18))

        }}>
          Claim Honey
        </button>
      </div>

    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1> HNY Faucet </h1>
            <p>Convert BEE tokens to HNY tokens</p>
            <OnlyGuestLinks/>
          </div>
        </div>
      </main>
    )
  }
}

export default HoneyFaucet
