import React from 'react'
import PropTypes from 'prop-types'
import NodeBox from '../components/Node'

export const NodeStory = ({ ...props }) => {
  return <NodeBox {...props} />
}

NodeStory.propTypes = {
  pos: PropTypes.object,
  title: PropTypes.string,
  completed: PropTypes.bool,
  pieces: PropTypes.array,
}

NodeStory.defaultProps = {
  pos: {
    x: 0,
    y: 0,
  },
  completed: false,
  title: 'デフォルトタイトル',
}
