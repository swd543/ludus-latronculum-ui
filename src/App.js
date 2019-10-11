import React from 'react';
import './App.css';

export default class App extends React.Component {

  constructor() {
    super()
    const dimensions = { ulrich: { rows: 8, columns: 8, lineup: 2 }, kowalski: { rows: 8, columns: 12, lineup: 1, dux: { x: 3 } } }
    const defaultState = undefined

    this.initalizeBoard = (name) => {
      name = name || 'ulrich'
      const dim = dimensions[name]
      const board = []

      for (var i = 0; i < dimensions[name].lineup; i++) {
        board.push(new Array(dim.columns).fill('black'))
      }
      for (var j = 0; j < dim.rows - 2 * dimensions[name].lineup; j++) {
        board.push(new Array(dim.columns).fill(defaultState))
      }
      for (var k = 0; k < dimensions[name].lineup; k++) {
        board.push(new Array(dim.columns).fill('white'))
      }

      dim.dux && (board[dim.lineup][dim.dux.x] = 'dux ' + board[1][1])
      dim.dux && (board[dim.rows - dim.lineup - 1][dim.columns - dim.dux.x - 1] = 'dux ' + board[1][1])
      this.setState({ name, retired: this.getRetired() })
      return board;
    }
    this.getRetired = () => []
    this.state = { board: this.initalizeBoard(), dimensions, retired: this.getRetired() }
    this.dimensionString = dimensions.rows + 'x' + dimensions.columns
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

  dropHandlerRetired = (e) => {
    const { retired, board } = this.state
    const data = JSON.parse(e.dataTransfer.getData("dragData"))
    board[data.i][data.j] = this.defaultState
    retired.push(data.c)
    this.setState({ board: board, retired: retired }, this.countPieces)
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
          <button onClick={() => this.setState({ board: this.initalizeBoard('ulrich') })}>
            Ulrich
          </button>
          <button onClick={() => this.setState({ board: this.initalizeBoard('kowalski') })}>
            Kowalski
          </button>
          {
            this.state.counts && Object.entries(this.state.counts).filter(v => v[0] !== 'undefined').map((k, v) => <p key={v}>{k[0]} : {k[1]}</p>)
          }
          <p>
            Board is {this.state.board && this.state.board.length}x{this.state.board && this.state.board[0].length}
          </p>
        </div>
        <div className="Game">
          <div style={{ minHeight: 80, display: 'flex', alignItems: 'center' }}>
            <h1 style={{ margin: 'auto' }}>
              {this.state.name || 'ulrich'}
            </h1>
          </div>
          <div style={{ margin: 'auto' }}>
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
          <div style={{ border: '1px dashed green', minHeight: 80, display: 'flex' }} onDrop={this.dropHandlerRetired}
            onDragOver={(e) => {
              e.preventDefault()
            }}>
            {this.state.retired && this.state.retired.map((k, v) => <div key={v} className={k} style={{ padding: 40, margin: 4 }}></div>)}
          </div>
        </div>
      </div>
    );
  }
}