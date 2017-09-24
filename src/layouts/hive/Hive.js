import React, {Component} from 'react'
import {Link} from 'react-router'

class Hive extends Component {
  constructor(props, {authData}) {
    super(props)
    authData = this.props
  }

  render() {
    return (
      <main className = "container">
        <div className = "pure-g">
          <div className = "pure-u-1-1">
            <h1> {this.props.params.name}</h1> 
          </div>
        </div>
     </main>
    )
  }
}

export default Hive
