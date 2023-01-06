/**
 * Instance is not allowed in Redux
 *   https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data
 *   https://qiita.com/crispy/items/e4e2279aedd3221cdc23
 */
export default class Root {
  static struct(arg) {
    const def = arg?.def
    const facts = arg?.facts
    const boxes = arg?.boxes
    const binds = arg?.binds
    return { def, facts, boxes, binds }
  }
}
