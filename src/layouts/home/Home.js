import React, {Component} from 'react'
import { Link } from 'react-router'

import hiveLogo from '../../img/hive-logo.png'

const dummyData = [
  {key: '1', name: 'United Nations', description: 'This is the UN. We like pizza.' , link: 'unitednations'},
  {key: '2', name: 'Pizza Town', description: 'This is the UN. We like pizza.' , link: 'pizzatown'}
]

const listItems = dummyData.map((item)=>
  <tr key={item.key}>
    <td>{item.name}</td>
    <td>{item.description}</td>
    <td>
      <Link className="pure-button" to={'hive/' + item.link}>View</Link>
    </td>
  </tr>
)

class Home extends Component {
  render() {
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">

            <img className="logo" src={hiveLogo}></img>
            <h1 hidden>Hive Commons</h1>
            <h2>Tokenize Public Interest</h2>

            <table className="pure-table pure-table-horizontal">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>View</th>
                </tr>
              </thead>

              <tbody>
                {listItems}
              </tbody>

            </table>

          </div>
        </div>
      </main>
    )
  }
}

export default Home
