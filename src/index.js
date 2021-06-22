import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import HexGrid from "./game/hexComponents";
import {HexagonMap, ParallelogramMap} from "./game/hexaboard";

ReactDOM.render(
    <HexGrid map={HexagonMap(5)}/>,
    // <HexGrid map={ParallelogramMap(6, 7)}/>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
