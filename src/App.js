import './App.css';
import React from 'react'
import HexGrid from "./game/hexComponents";
import {HexagonMap, ParallelogramMap} from "./game/hexaboard";

import { io } from 'socket.io-client'


const socket = io('http://localhost:3000')


function App() {

    return (
        <Timer render={(time) => (
            <HexGrid map={HexagonMap(5)} currentTime={time}/>
            // <HexGrid map={ParallelogramMap(6, 7)}/>,
        )}/>
    );
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
