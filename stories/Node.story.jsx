import React from 'react'
import PropTypes from 'prop-types'
import NodeBox from '../components/Node'

export const NodeStory = ({ ...props }) => {
  return <NodeBox {...props} />
}

NodeStory.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  title: PropTypes.string,
  pieces: PropTypes.array,
}

NodeStory.defaultProps = {
  pos: {
    x: 0,
    y: 0,
  },
  title: 'デフォルトタイトル',
}
