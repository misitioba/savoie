import React from 'react'
import styled from 'styled-components'
import Nav from './Nav'
import auth from './utils/auth'
const Root = styled.div`
  display: flex;
`

const NavParent = styled.div`
  width: 230px;
  background: #f3eded;
  height: calc(100vh);
`

const MainContent = styled.div`
  width: 100%;
  padding: 20px;
`

export default class Sidebar extends React.Component {
  constructor () {
    super()
    this.state = {
      innerWidth: window.innerWidth,
      loaded: false
    }
  }
  async componentDidMount () {
    await auth.checkAuthenticated()
    this.setState({
      loaded: true
    })

    this.checkScreenSize = setInterval(() => {
      this.setState({
        innerWidth: window.innerWidth
      })
    }, 2000)
  }
  componentWillUnmount () {
    clearInterval(this.checkScreenSize)
  }
  componentDidUpdate () {}
  render () {
    return this.state.loaded ? (
      <Root>
        {auth.isAuthenticated ? (
          <NavParent>
            <Nav />
          </NavParent>
        ) : (
          ''
        )}

        <MainContent>
          {this.state.innerWidth < 768 ? (
            <h1>Screen > 768px required</h1>
          ) : (
            this.props.children
          )}
        </MainContent>
      </Root>
    ) : (
      <div />
    )
  }
}
