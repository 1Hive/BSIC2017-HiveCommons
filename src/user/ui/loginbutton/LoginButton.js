import React from 'react'

// Images
import uPortLogo from '../../../img/uport-logo.svg'

const LoginButton = ({ onLoginUserClick }) => {
  return(
    <a href="#"
      className="pure-button uport"
      onClick={(event) => onLoginUserClick(event)}>
      <img className="button-icon button-icon-right" src={uPortLogo} alt="UPort Logo" />Login with UPort
    </a>
  )
}

export default LoginButton
