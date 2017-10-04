import React, {Component} from 'react'
import { Link } from 'react-router'

import hiveLogo from '../../img/hive-logo.png'

import HiveList from '../hives/HiveList'

class Home extends Component {
  render() {
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">

            <img className="logo" src={hiveLogo}></img>
            <h1 hidden>Hive Commons</h1>
            <h2>Tokenize Public Interest</h2>

              <div className="pure-g">
                <div className="pure-u-1 pure-u-lg-1-3">
                  <h3>BEE Tokens</h3>
                  <p>One BEE token is issued to each person. BEE tokens ensure that HNY tokens are being distributed evenly. Use your BEE token to claim HNY tokens each month.</p>
                  <Link className='pure-button pure-button-primary' to='/faucet/bee'>BEE Faucet</Link>
                </div>
                <div className="pure-u-1 pure-u-lg-1-3">
                  <h3>HNY Tokens</h3>
                  <p>Each month a new batch of HNY tokens will be made available to BEE holders. HNY tokens can be used to participate in HiveCommons governance.</p>
                  <Link className='pure-button pure-button-primary' to='/faucet/hny'>HNY Faucet</Link>
                </div>
                <div className="pure-u-1 pure-u-lg-1-3">
                  <h3>HiveCommons</h3>
                  <p>Each month a new batch of HNY tokens will be made available to BEE holders. HNY tokens can be used to participate in HiveCommons governance.</p>
                </div>
              </div>

          </div>
        </div>
      </main>
    )
  }
}

export default Home
