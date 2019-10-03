import React from 'react'
import styled from 'styled-components'
import api from './utils/api'
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: darkslateblue;
`

const Form = styled.textarea`
  width: 100%;
  min-height: 200px;
  margin-bottom: 20px;
  margin-top: 10px;
`

export default class Module extends React.Component {
  constructor () {
    super()
    this.state = {
      moduleJSON: '',
      module: {}
    }
  }
  isNew () {
    return this.props.match.params.title === 'new'
  }
  async componentDidMount () {
    if (this.isNew()) {
      this.setState({
        moduleJSON: JSON.stringify(
          {
            title: '',
            db_name: '',
            enabled: 0
          },
          null,
          4
        )
      })
    } else {
      await this.fetch()
    }
  }
  async handleRemove () {
    let data = this.state.module
    try {
      data = JSON.parse(this.form.value.trim())
    } catch (err) {
      console.error(err.stack)
    }
    if (window.confirm('Sure?')) {
      await api({
        name: 'removeModule',
        args: [data.id]
      })
      this.props.history.push(`/console/modules`)
    }
  }
  async handleFormChange () {
    let data = this.state.module
    try {
      data = JSON.parse(this.form.value.trim())
    } catch (err) {
      console.error(err.stack)
    }

    let _fields = ['db_name', 'updated_at', 'enabled']
    if (this.isNew()) {
      _fields.unshift('title')
    }
    if (!data.title) {
      return alert('Title required')
    }
    if (data.enabled !== 0 && data.enabled !== 1) {
      data.enabled = 0
    }
    await api({
      name: 'save',
      args: [
        {
          _table: 'modules',
          _fields,
          ...data,
          ...{
            updated_at: Date.now()
          }
        }
      ]
    })
    this.props.history.push(`/console/modules`)
  }
  async fetch () {
    let state = {
      module: await api({
        name: 'query',
        args: [
          {
            select: `* FROM modules WHERE title = ?`,
            params: [this.props.match.params.title],
            single: true
          }
        ]
      })
    }
    state.moduleJSON = JSON.stringify(state.module, null, 4)
    this.setState(state)
  }
  render () {
    return (
      <div>
        {!this.isNew() ? (
          <Title>Module {this.props.match.params.title}</Title>
        ) : (
          <Title>New Module</Title>
        )}
        <Form
          defaultValue={this.state.moduleJSON}
          ref={el => (this.form = el)}
          onChange={() => {}}
        />
        <p className='buttons'>
          <button
            className='button is-success'
            onClick={() => this.handleFormChange()}
          >
            Save
          </button>

          {this.isNew() ? (
            ''
          ) : (
            <button
              className='button is-danger'
              onClick={() => this.handleRemove()}
            >
              Remove
            </button>
          )}
        </p>
      </div>
    )
  }
}
