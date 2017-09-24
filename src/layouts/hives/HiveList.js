import React, {Component} from 'react'
import {Link} from 'react-router'


const dummyData = [
  {key: '1', name: 'United Nations', description: 'This is the UN. We like pizza.' , link: 'unitednations'},
  {key: '2', name: 'Pizza Town', description: 'This is the UN. We like pizza.' , link: 'pizzatown'}
]

const listItems = dummyData.map((item)=>
  <tr key={item.key}>
    <td>{item.name}</td>
    <td>{item.description}</td>
    <td>
      <Link className="pure-button" to={'hives/' + item.link}>View</Link>
    </td>
  </tr>
)

class HiveList extends Component {
  constructor(props, {authData}) {
    super(props)
    authData = this.props
  }

  render() {
    return (
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
    )
  }
}

export default HiveList
