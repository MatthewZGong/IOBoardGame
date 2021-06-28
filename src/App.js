import './App.css';
import React from 'react'
import HexGrid from "./game/hexComponents";
import {socket} from "./socker/socketContext";


class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            board: undefined
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
        socket.emit('move-char', char_id, tile, this.updateMap)
    }


    render() {

        const grid_component = (time) => {

            if (this.state.board) {
                const board = this.state.board
                return (
                    <HexGrid hexes={board.hexes}
                             allyPositions={board.allyPositions} enemyPositions={board.enemyPositions}
                             moveChar={this.moveChar}
                             currentTime={time}/>
                )
            } else {
                return <h1>Waiting for map to load...</h1>
            }
        }

        return (
            <Timer render={grid_component}/>
        )
    }
}


class Timer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            time: 0
        }
    }

    getTime() {
        return this.state.time
    }

    componentDidMount() {
        this.timer = setInterval(() => this.tick(), 1000)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    tick() {
        this.setState((state) => ({
            time: state.time + 1
        }))
    }


    render() {
        return (
            <div>
                Time since started: {this.state.time} seconds
                {this.props.render(this.state)}
            </div>
        )
    }
}


export default App;
