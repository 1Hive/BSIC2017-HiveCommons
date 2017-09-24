import React from 'react'

const LogoutButton = ({ onLogoutUserClick }) => {
  return(
    <a href="#" className="pure-menu-link" onClick={(event) => onLogoutUserClick(event)}>Logout</a>
  )
}

export default LogoutButton
