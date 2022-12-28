import React from 'react'
import { Stage, Layer } from 'react-konva'
import { NodeStory } from './Node.story'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'rezo/Node',
  component: NodeStory,
  argTypes: {},
  decorators: [
    (Story) => (
      <Stage width={window.innerWidth} height={window.innerHeight} draggable>
        <Layer>
          <Story />
        </Layer>
      </Stage>
    ),
  ],
}

const Template = (args) => <NodeStory {...args} />

export const Normal = Template.bind({})
Normal.args = {
  id: 'abcd123',
  pos: {
    x: 30,
    y: 30,
  },
  title: 'サンプル1 タイトル',
  pieces: {
    b002: { title: 'サブ1 タイトル', sort: 1, completed: true },
    b003: { title: 'サブ2 タイトル', sort: 2, completed: true },
    b004: { title: 'サブ3 タイトル', sort: 3, completed: true },
    b005: { title: 'サブ4 タイトル', sort: 4, completed: false },
  },
}

export const Blank = Template.bind({})
Blank.args = {
  id: 'abcd123',
  pos: {
    x: 10,
    y: 55,
  },
  title: 'サンプル2 タイトル',
}
