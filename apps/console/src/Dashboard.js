import React from 'react'
import styled from 'styled-components'

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: darkslateblue;
`

export default class Dashboard extends React.Component {
  constructor () {
    super()
    this.state = {}
  }
  async componentDidMount () {}

  render () {
    return (
      <div>
        <Title>Dashboard</Title>
      </div>
    )
  }
}
