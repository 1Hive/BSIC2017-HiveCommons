import React, { Component } from 'react'

import hiveLogo from '../../img/hive-logo.png'

class Home extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">

            <img className="logo" src={hiveLogo}></img>

            <div className="home-text">
              <h2>Tokenize Public Interest</h2>
            </div>

          </div>
        </div>
      </main>
    )
  }
}

export default Home
