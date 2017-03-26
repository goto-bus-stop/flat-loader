import prism from 'prismjs'
import 'prismjs/themes/prism-dark.css'
// Our webpack config will use preact here instead!
import React, { Component } from 'react'

export default class extends Component {
  componentDidMount () {
    this.container.innerHTML =
      prism.highlight(this.props.source, prism.languages.javascript)
  }

  render () {
    const refContainer = (container) => {
      this.container = container
    }

    return (
      <code>
        <pre ref={refContainer}>
          {this.props.source}
        </pre>
      </code>
    )
  }
}
