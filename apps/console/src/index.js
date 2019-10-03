import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import Main from './Main'
import Sidebar from './Sidebar'

const App = (
  <div>
    <Sidebar>
      <Main />
    </Sidebar>
  </div>
)

ReactDOM.render(
  <BrowserRouter>{App}</BrowserRouter>,
  document.getElementById('app')
)
