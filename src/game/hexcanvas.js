import React from 'react';
import {Map} from "./hexaboard";
class Canvas extends React.Component {

    state = {
        hexSize: 50,
        hexOrigin: {x: 100, y: 130},
        canvasSize: {canvasWidth: 800, canvasHeight: 600}
    }

    componentDidMount() {
        const { canvasWidth, canvasHeight } = this.state.canvasSize;
        this.canvashex.width = canvasWidth;
        this.canvashex.height = canvasHeight;
        this.map = new Map()
        this.map.rectangle(5,5)
        this.map.m.forEach((value) => { 
            this.drawHex(this.canvashex, this.map.layout.hexToPixel(value));
        })
        this.drawHex(this.canvashex, {x: 1, y: 1})
    }

    drawHex(canvasID, center) {
        for (let i = 0; i < 6; i++) {
            let start = this.getHexCornerCord(center, i);
            let end = this.getHexCornerCord(center, i + 1);
            this.drawLine(canvasID, {x: start.x, y: start.y}, {x: end.x, y: end.y});
        }
    }

    getHexCornerCord(center, i) {
        let angle_deg = 60 * i - 30;
        let angle_rad = Math.PI / 180 * angle_deg;
        let x = center.x + this.state.hexSize * Math.cos(angle_rad);
        let y = center.y + this.state.hexSize * Math.sin(angle_rad);
        return this.Point(x, y);
    }

    Point(x, y) {
        return {x: x, y: y}
    }

    drawLine(canvasID, start, end) {
        const ctx = canvasID.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.closePath();
    }

    render() {
        return (
            <div>
                <canvas ref={canvashex => this.canvashex = canvashex}/>
            </div>
        )
    }


}

export {Canvas as default}