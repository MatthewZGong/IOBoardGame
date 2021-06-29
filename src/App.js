import './App.css';
import React from 'react'
import HexGrid from "./game/hexComponents";
import {ResponseArea} from "./game/textBoxes";
import {socket} from "./socker/socketContext";


class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            board: undefined,
            textBoxSize: 200,
            actions: false
        }
    }

    updateMap = () => {
        socket.emit('request-map', (hexes, allyPositionsList, enemyPositionsList) => {
            let allyPositions = new Set()
            let enemyPositions = new Set()

            function addPos(array) {
                function stringify(pos) {
                    array.add(pos.toString())
                }
                return stringify
            }

            allyPositionsList.forEach(addPos(allyPositions))
            enemyPositionsList.forEach(addPos(enemyPositions))

            this.setState({
                board: {
                    hexes: hexes,
                    allyPositions: allyPositions,
                    enemyPositions: enemyPositions
                }
            })
        })
    }

    componentDidMount() {
        socket.on('connect', () => {
            this.updateMap()
        });
    }

    componentWillUnmount() {
        socket.off('connect')
    }

    moveChar = (char_id, tile) => {
        socket.emit('move-char', char_id, tile, () => {
            this.updateMap()
            this.promptAction(char_id)
        })
    }


    promptAction = (char_id) => {
        socket.emit('request-char.actions', char_id,
            (actions) => {
                this.setState({
                    actions: actions
                })
            }
        )
    }

    selectAction = (action) => {
        this.setState({
            actions: false
        })
    }


    render() {
        const board = this.state.board

        const readyComponent = () => {

            const hexGrid = (
                <HexGrid hexes={board.hexes}
                         allyPositions={board.allyPositions} enemyPositions={board.enemyPositions}
                         moveChar={this.moveChar}
                />
            )

            return (
                <div>
                    <div style={{marginTop: this.state.textBoxSize, position: "relative"}}>
                        {hexGrid}
                    </div>
                    {this.state.actions ? <ResponseArea height={this.state.textBoxSize}
                                                       choices={this.state.actions} onChoice={this.selectAction}/>
                        : undefined}
                </div>
            )
        }

        return (
            this.state.board ? readyComponent() : <h1>Waiting for map to load...</h1>
        )
    }
}


export default App;
