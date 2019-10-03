import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import auth from './utils/auth'
const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 20px;
`

const NavLink = styled.span`
  color: #ff3d60;
  font-size: 20px;
  padding: 20px 0px;
  display: block;
  cursor: pointer;
  &:hover {
    color: red;
  }
`

export default class Nav extends React.Component {
  constructor () {
    super()
  }
  componentDidMount () {}
  componentWillUnmount () {}
  componentDidUpdate () {}
  handleNavClick () {}
  handleLogout () {
    auth.logout()
    window.location.href = '/console/login'
  }
  render () {
    return (
      <Root>
        <Link to={{ pathname: '/console' }}>
          <NavLink>Dashboard</NavLink>
        </Link>
        <Link to={{ pathname: '/console/modules' }}>
          <NavLink>Modules</NavLink>
        </Link>

        <NavLink onClick={() => this.handleLogout()}>Logout</NavLink>
      </Root>
    )
  }
}
