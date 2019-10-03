import React from 'react'
import styled from 'styled-components'
import auth from './utils/auth'
import api from './utils/api'
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: darkslateblue;
`

const LoginForm = styled.div`
  max-width: 400px;
  border: 1px solid #e6e0e0;
  padding: 50px;
  display: flex;
  justify-content: center;
  align-items: initial;
  margin: 0 auto;
  flex-direction: column;
  margin-top: 20px;
`

export default class Login extends React.Component {
  async componentDidMount () {
    await auth.checkAuthenticated()
    if (auth.isAuthenticated) {
      this.props.history.push('/console')
    }
  }
  componentDidUpdate () {}
  async handleLogin () {
    let result = await api({
      name: 'login',
      args: ['', this.password.value]
    })
    if (result.token) {
      localStorage.setItem('token', result.token)
      await auth.checkAuthenticated()
      if (auth.isAuthenticated) {
        this.props.history.push('/console')
      }
    }
  }
  render () {
    // <input placeholder='username' ref={input => (this.username = input)} />
    return (
      <div>
        <Title>Savoie Console</Title>
        <LoginForm>
          <div className='field'>
            <p className='control has-icons-left'>
              <input
                className='input'
                type='password'
                placeholder='Password'
                ref={input => (this.password = input)}
              />
              <span className='icon is-small is-left'>
                <i className='fas fa-lock' />
              </span>
            </p>
          </div>

          <a className='button is-link' onClick={() => this.handleLogin()}>
            Login
          </a>
        </LoginForm>
      </div>
    )
  }
}
