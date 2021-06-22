import React from 'react'
import {Orientation} from "./hexaboard";

class HexGrid extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            radius: 10,
            hexSize: 50
        }
    }

    clickEvent = (e) => {
        console.log(e.pageX + ' ' + e.pageY);
        console.log(this.props.currentTime);
    }

    render() {

        const {hexCenters, hexDimensions} = getSVGContent(this.props.map.m, this.state.hexSize);
        const {totalWidth, totalHeight, leftEdge, topEdge} = hexDimensions;

        // example viewBox value: '0 0 25 25'
        const svgViewBox = leftEdge + ' ' + topEdge + ' ' + totalWidth + ' ' + totalHeight

        let hexes = hexCenters.map((hexInfo) => {
            return (<HexTile hexSize={this.state.hexSize} center={hexInfo.center}
                             key={hexInfo.hexCor}/>)
        })

        return (
            <svg viewBox={svgViewBox} width={totalWidth} height={totalHeight}
                 fill={"transparent"} stroke={"purple"} strokeWidth={1}
                 onClick={this.clickEvent}>
                {hexes}
            </svg>
        )
    }
}

function getSVGContent(hexCords, hexSize) {

    const or = new Orientation(
        Math.sqrt(3.0),
        Math.sqrt(3.0) / 2.0,
        0.0,
        3.0 / 2.0,
        Math.sqrt(3.0) / 3.0,
        -1.0 / 3.0,
        0.0,
        2.0 / 3.0,
        0.5
    );

    const size = {
        x: hexSize,
        y: hexSize
    }

    const halfWidth = hexSize * Math.sqrt(3) / 2;
    const halfHeight = hexSize;


    let dimensions = {
        minX: 0,
        minY: 0,
        maxX: 0,
        maxY: 0
    }

    let hexCenters = [];
    for (let hexCor of hexCords) {
        const center = hexToPixel(hexCor, or, size);
        hexCenters.push({
            center: center,
            hexCor: hexCor
        });

        if (center.x - halfWidth < dimensions.minX) dimensions.minX = center.x - halfWidth
        if (center.y - halfHeight < dimensions.minY) dimensions.minY = center.y - halfHeight
        if (center.x + halfWidth > dimensions.maxX) dimensions.maxX = center.x + halfWidth
        if (center.y + halfHeight > dimensions.maxY) dimensions.maxY = center.y + halfHeight
    }

    return {
        hexCenters: hexCenters,
        hexDimensions: {
            totalWidth: dimensions.maxX - dimensions.minX,
            totalHeight: dimensions.maxY - dimensions.minY,
            leftEdge: dimensions.minX,
            topEdge: dimensions.minY
        }
    }
}


function hexToPixel(hex, or, size){
    const vec = hex.vector
    const x = (or.f0 * vec[0] + or.f1 * vec[1]) * size.x;
    const y = (or.f2 * vec[0] + or.f3 * vec[1]) * size.y;
    return {
        x: x,
        y: y
    }
}


class HexTile extends React.Component {

    constructor(props) {
        super(props);

        this.defaultColor = 'red'
        this.hoverColor = 'yellow'
        this.toggleColor = 'black'

        this.defaultFill = 'transparent'

        this.state = {
            color: this.defaultColor,
            toggle: false,
            strokeWidth: 1
        }
    }

    getHexCornerCords() {
        return [0, 1, 2, 3, 4, 5].map((i) => this.getHexCornerCord(i))
    }

    getHexCornerCord(i) {
        const angle_deg = 60 * i - 30;
        const angle_rad = Math.PI / 180 * angle_deg;

        let x = this.props.center.x + this.props.hexSize * Math.cos(angle_rad);
        let y = this.props.center.y + this.props.hexSize * Math.sin(angle_rad);
        return {
            x: x,
            y: y
        };
    }

    mouseHoverEvent = () => {
        this.setState({
            fill: this.hoverColor,
            strokeWidth: 2
        })
    }

    mouseLeaveEvent = () => {
        this.setState({
            fill: this.defaultFill,
            strokeWidth: 1
        })
    }

    clickEvent = () => {
        // set state with arrow function to avoid jumbled behavior with React's setState async batching
        this.setState((state) => ({
            toggle: !state.toggle,
            color: state.toggle ? this.defaultColor : this.toggleColor
        }))
    }


    render() {
        let points = '';
        for (let point of this.getHexCornerCords()) {
            points += point.x + ',' + point.y + ' ';
        }

        return (
            <polygon points={points} stroke={this.state.color} fill={this.state.fill}
                     strokeWidth={this.state.strokeWidth}
                     onClick={this.clickEvent}
                     onMouseEnter={this.mouseHoverEvent}
                     onMouseLeave={this.mouseLeaveEvent}
            />
        )
    }
}

export {HexGrid as default}