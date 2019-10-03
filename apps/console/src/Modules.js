import React from 'react'
import styled from 'styled-components'
import api from './utils/api'
import { moment } from './utils/date'
import { Link } from 'react-router-dom'
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: darkslateblue;
`
const List = styled.ul`
  margin-bottom: 20px;
`

const TrLink = styled.tr`
  &:hover {
    cursor: pointer;
    background-color: #ece8ff;
  }
`

export default class Modules extends React.Component {
  constructor () {
    super()
    this.state = {
      modules: []
    }
  }
  async componentDidMount () {
    this.setState({
      modules: await api({
        name: 'getModules'
      })
    })
  }
  clickModule (module) {
    this.props.history.push(`/console/module/${module.title}`)
  }
  render () {
    return (
      <div>
        <Title>Modules</Title>

        <div className='table-container'>
          <table className='table is-fullwidth'>
            <tbody>
              <tr>
                <th>Title</th>
                <th>Updated at</th>
              </tr>
              {this.state.modules.map(m => (
                <TrLink key={m.title} onClick={() => this.clickModule(m)}>
                  <td>{m.title} </td>
                  <td>
                    {m.updated_at
                      ? `Updated at ${moment(m.updated_at).format(
                        'DD-MM-YYYY HH:mm'
                      )}`
                      : ''}
                  </td>
                </TrLink>
              ))}
            </tbody>
          </table>
        </div>

        <Link to={{ pathname: '/console/module/new' }}>
          <button className='button is-normal'>New Module</button>
        </Link>
      </div>
    )
  }
}
