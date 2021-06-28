import React from 'react'
import {Orientation} from "./hexaboard";
import {socket} from "../socker/socketContext";

class HexGrid extends React.Component {

    constructor(props) {
        super(props);

        this.currentlySelected = undefined

        let colorMap = {}
        props.hexes.forEach((hex) => {
            colorMap[hex.vector.toString()] = {
                hex: hex
            }
        })

        this.state = {
            hexSize: 50,
            colorMap: colorMap
        }
    }

    updateColorMap = (tile, name, value) => {
        const colorMap = this.state.colorMap
        colorMap[tile.toString()][name] = value
        this.setState({
            colorMap: colorMap
        })
    }

    getColorMapValue = (tile, name) => {
        return this.state.colorMap[tile.toString()][name]
    }

    charClickEvent = (tile) => {

        if (this.currentlySelected) {
            this.fillRange(this.currentlySelected, undefined)
        }

        const nextSelected = vecEqual(this.currentlySelected, tile) ? undefined : tile
        if (nextSelected) {
            this.fillRange(nextSelected, 'gray')
        }

        this.currentlySelected = nextSelected
    }

    fillRange(tile, color) {
        const char_id = this.props.allyPositions.has(tile.toString()) ? 1 : 2
        socket.emit('request-map.char-range', char_id, // 1 is a hardcoded char id
            (hexes) => {
                const colorMap = this.state.colorMap
                for (let hex of hexes) {
                    colorMap[hex.vector.toString()]['fill'] = color
                }
                this.setState({
                    colorMap: colorMap
                })
            })
    }

    render() {

        const {hexCenters, hexDimensions} = getSVGContent(this.props.hexes, this.state.hexSize);
        const {totalWidth, totalHeight, leftEdge, topEdge} = hexDimensions;

        // example viewBox value: '0 0 25 25'
        const svgViewBox = leftEdge + ' ' + topEdge + ' ' + totalWidth + ' ' + totalHeight

        let hexTiles = hexCenters.map((hexInfo) => {

            const tile = hexInfo.hex.vector

            const isAllyTile = this.props.allyPositions.has(tile.toString())
            const isEnemyTile = this.props.enemyPositions.has(tile.toString())
            let fillColor =  isAllyTile ? 'lime' : isEnemyTile ? 'blue' : undefined

            const forceColor = this.getColorMapValue(tile, 'fill')
            if (!fillColor && forceColor) {
                fillColor = forceColor
            }

            return (<HexTile hexSize={this.state.hexSize} center={hexInfo.center}
                             fill={fillColor}
                             onClick={isAllyTile || isEnemyTile ? () => this.charClickEvent(tile) : undefined}
                             key={tile}/>)
        })

        return (
            <svg viewBox={svgViewBox} width={totalWidth} height={totalHeight}
                 fill={"transparent"} stroke={"purple"} strokeWidth={1}
                 onClick={this.clickEvent}>
                {hexTiles}
            </svg>
        )
    }
}


function vecEqual(vec1, vec2) {
    if (!vec1 || !vec2) {
        return false
    }

    for (let i = 0; i < 3; i++) {
        if (vec1[i] !== vec2[i]) {
            return false
        }
    }
    return true
}


function getSVGContent(hexes, hexSize) {

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
    for (let hex of hexes) {
        const center = hexToPixel(hex, or, size);
        hexCenters.push({
            center: center,
            hex: hex
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

        this.lineColor = 'red'
        this.toggleColor = 'black'

        this.fillColor = 'transparent'

        this.state = {
            color: this.lineColor,
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
        this.fillColor = 'yellow'
        if (!this.props.fill) this.forceUpdate()
    }

    mouseLeaveEvent = () => {
        this.fillColor = 'transparent'
        if (!this.props.fill) this.forceUpdate()
    }

    clickEvent = () => {
        // set state with arrow function to avoid jumbled behavior with React's setState async batching
        this.setState((state) => ({
            toggle: !state.toggle,
            color: state.toggle ? this.lineColor : this.toggleColor
        }))
    }


    render() {
        let points = '';
        for (let point of this.getHexCornerCords()) {
            points += point.x + ',' + point.y + ' ';
        }

        return (
            <polygon points={points} stroke={this.state.color} fill={this.props.fill || this.fillColor}
                     strokeWidth={this.state.strokeWidth}
                     onClick={this.props.onClick || this.clickEvent}
                     onMouseEnter={this.mouseHoverEvent}
                     onMouseLeave={this.mouseLeaveEvent}
            />
        )
    }
}

export {HexGrid as default}