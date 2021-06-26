import './App.css';
import React from 'react'
import HexGrid from "./game/hexComponents";
import {socket} from "./socker/socketContext";


class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hexes: undefined,
        }
    }

    componentDidMount() {

        socket.on('connect', () => {
            socket.emit('request-map', (hexes) => {
                this.setState({
                    hexes: hexes
                })
            })
        });

    }

    componentWillUnmount() {
        socket.off('connect')
    }


    render() {

        const grid_component = (time) => {

            if (this.state.hexes) {
                return (
                    <HexGrid hexes={this.state.hexes} currentTime={time}/>
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
