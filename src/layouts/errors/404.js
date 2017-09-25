import React, {Component} from 'react'
import {Link} from 'react-router'

class Page404 extends Component {
  constructor(props, {authData}) {
    super(props)
    authData = this.props
  }

  render() {

    return (
      <main className = "container">
        <div className = "pure-g">
          <div className = "pure-u-1-1">
            <h1> page not found</h1>
            <Link to="/" className="pure-button">Home</Link>
          </div>
        </div>
     </main>
    )
  }
}

export default Page404
