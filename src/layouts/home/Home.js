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

            <Link to="hives/new" className="pure-button">Add new Hive</Link>

            <hr></hr>

            <HiveList/>

          </div>
        </div>
      </main>
    )
  }
}

export default Home
