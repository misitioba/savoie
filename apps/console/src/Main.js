import React from 'react'
import Dashboard from './Dashboard'
import Login from './Login'
import Module from './Module'
import auth from './utils/auth'
import { Switch, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Modules from './Modules'
export default class Main extends React.Component {
  constructor () {
    super()
    this.state = {
      loaded: false
    }
  }
  async componentDidMount () {
    await auth.checkAuthenticated()
    this.setState({
      loaded: true
    })
  }
  render () {
    return (
      <main>
        {this.state.loaded ? (
          <Switch>
            <PrivateRoute exact path='/console' component={Dashboard} />
            <Route exact path='/console/login' component={Login} />
            <PrivateRoute
              exact
              path='/console/module/:title'
              component={Module}
            />
            <PrivateRoute exact path='/console/modules' component={Modules} />
          </Switch>
        ) : (
          ''
        )}
      </main>
    )
  }
}
