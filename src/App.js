import React from 'react';
import './App.css';

export default class App extends React.Component {

  constructor() {
    super()
    const dimensions = { rows: 7, columns: 8 }
    const defaultState = undefined

    this.initalizeBoard = () => {
      const board = []
      board.push(new Array(dimensions.columns).fill('black'))
      for (var i = 0; i < dimensions.rows - 2; i++) {
        board.push(new Array(dimensions.columns).fill(defaultState))
      }
      board.push(new Array(dimensions.columns).fill('white'))
      return board;
    }
    this.state = { board: this.initalizeBoard(), dimensions }
  }

  // Drag handler
  dragStartHandler = (d) => (e) => {
    e.dataTransfer.setData("dragData", JSON.stringify(d))
    // console.log(d, e);
  }

  // Count black and white pieces
  countPieces = () => {
    var counts = {}
    this.state.board.forEach(r => r.forEach(d => counts[d] === this.defaultState ? counts[d] = 0 : counts[d]++))
    this.setState({ counts: counts })
  }

  // Handler for dragOver
  dragOverHandler = (d) => (e) => {
    e.preventDefault()
  }

  // Handler for drop event
  dropHandler = (d) => (e) => {
    const { i, j } = d
    const { board } = this.state
    const data = JSON.parse(e.dataTransfer.getData("dragData"))
    board[data.i][data.j] = this.defaultState
    board[i][j] = data.c
    // console.log(d, e, i, j, board, data)
    this.setState({ board: board }, this.countPieces)
  }

  render() {
    return (
      <div className="App">
        <div className="Drawer" onDrop={this.dropHandler({})}>
          <p style={{ padding: 5 }}>
            Placeholder for game status
          </p>
          <button onClick={() => this.setState({ board: this.initalizeBoard() })}>
            New game
          </button>
          {
            this.state.counts && Object.entries(this.state.counts).filter(v => v[0] !== 'undefined').map((k, v) => <p key={v}>{k[0]} : {k[1]}</p>)
          }
        </div>
        <div className="Game">
          <table>
            <tbody>
              {this.state.board.map((r, i) => <tr key={i}>
                {r.map((c, j) => <td key={j} className={c || ((i + j) % 2 === 0 ? 'odd' : 'even')} draggable={c !== undefined}
                  onDragStart={this.dragStartHandler({ c, i, j })}
                  onDragOver={this.dragOverHandler({})}
                  onDrop={this.dropHandler({ c, i, j })} />
                )}
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}