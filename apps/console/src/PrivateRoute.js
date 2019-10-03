import React from 'react'
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom'
import auth from './utils/auth'
export default function PrivateRoute ({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => {
        return auth.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/console/login',
              state: { from: props.location }
            }}
          />
        )
      }}
    />
  )
}
