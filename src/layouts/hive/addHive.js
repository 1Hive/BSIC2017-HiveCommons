import React, {Component} from 'react'
import {Link} from 'react-router'

class AddHive extends Component {
  constructor(props, {authData}) {
    super(props)
    authData = this.props
  }

  render() {
    return (
      <main className = "container">
        <div className = "pure-g">
          <div className = "pure-u-1-1">
            <h1> Add new Hive </h1>

              <form className="pure-form pure-form-aligned">
                  <fieldset>
                      <div className="pure-control-group">
                          <label htmlFor="name">Hive Name</label>
                          <input id="name" type="text" placeholder="e.g., Pizza Town"></input>
                      </div>

                      <div className="pure-controls">
                          <label htmlFor="cb" className="pure-checkbox">
                              <input id="cb" type="checkbox"></input> I've read the terms and conditions
                          </label>

                          <button type="submit" className="pure-button pure-button-primary">Submit</button>
                      </div>
                  </fieldset>
              </form>
          </div>
        </div>
     </main>
    )
  }
}

export default AddHive
