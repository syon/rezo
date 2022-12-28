export default class Rezo {
  static refreshRootOnMoving(root, arg) {
    const { boxes, binds } = root
    const pos = { x: arg.x, y: arg.y }
    const tgtBox = boxes[arg.id]
    tgtBox.pos = pos
    const newBoxes = { ...boxes, [arg.id]: tgtBox }
    return { boxes: newBoxes, binds }
  }
}
