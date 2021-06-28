import React from 'react'
import {Orientation} from "./hexaboard";
import {socket} from "../socker/socketContext";

const tinycolor = require('tinycolor2')

const LIME = '#00FF00'
const BLUE = '#0000FF'
const GRAY = '#808080'
const YELLOW = '#FFFF00'

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

    getColorMapValue = (tile, name) => {
        return this.state.colorMap[tile.toString()][name]
    }

    charClickEvent = (tile) => {

        if (this.currentlySelected) {
            if (vecEqual(tile, this.currentlySelected)) {
                this.fillRange(this.currentlySelected, undefined)
                this.currentlySelected = undefined
            }
        } else {
            this.fillRange(tile, 'gray')
            this.currentlySelected = tile

        }

    }

    getCharId = (tile) => {
        return this.props.allyPositions.has(tile.toString()) ? 1 : 2
    }

    fillRange(tile, color) {
        const char_id = this.getCharId(tile)
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

    moveChar = (tile) => {
        this.fillRange(this.currentlySelected, undefined)
        this.props.moveChar(this.getCharId(this.currentlySelected), tile)
        this.currentlySelected = undefined
    }

    render() {

        const {hexCenters, hexDimensions} = getSVGContent(this.props.hexes, this.state.hexSize);
        const {totalWidth, totalHeight, leftEdge, topEdge} = hexDimensions;

        // example viewBox value: '0 0 25 25'
        const svgViewBox = leftEdge + ' ' + topEdge + ' ' + totalWidth + ' ' + totalHeight

        const allies = []
        const enemies = []
        const colored = []
        const regular = []
        for (let i = 0; i < hexCenters.length; i++) {
            const hexInfo = hexCenters[i]
            const tile = hexInfo.hex.vector

            const tileIsAlly = this.props.allyPositions.has(tile.toString())
            const tileIsEnemy = this.props.enemyPositions.has(tile.toString())

            if (tileIsAlly) allies.push(hexInfo)
            else if (tileIsEnemy) enemies.push(hexInfo)
            else {
                const forceColor = this.getColorMapValue(tile, 'fill')

                if (forceColor) colored.push(hexInfo)
                else regular.push(hexInfo)
            }
        }

        const hexGroups = [
            <HexGroup hexCenters={allies} hexSize={this.state.hexSize}
                      fill={LIME}
                      onClick={this.charClickEvent}
                      key={"allies"}/>,
            <HexGroup hexCenters={enemies} hexSize={this.state.hexSize}
                      fill={BLUE}
                      onClick={this.charClickEvent}
                      key={"enemies"}/>,
            <HexGroup hexCenters={colored} hexSize={this.state.hexSize}
                      onClick={this.currentlySelected ? this.moveChar : undefined
                      }
                      fill={GRAY}
                      key={"range"}/>,
            <HexGroup hexCenters={regular} hexSize={this.state.hexSize}
                      key={"background"}/>
        ]

        return (
            <svg viewBox={svgViewBox} width={totalWidth} height={totalHeight}
                 onClick={this.clickEvent}>
                {hexGroups}
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


class HexGroup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            colorMap: {}
        }
    }

    updateColorMap = (tile, value) => {
        const colorMap = this.state.colorMap
        colorMap[tile.toString()] = value
        this.setState({
            colorMap: colorMap
        })
    }

    mouseHoverEvent = (tile) => {
        this.updateColorMap(tile, this.props.fill ?
            tinycolor(this.props.fill).darken(5).toString() : YELLOW)
    }

    mouseLeaveEvent = (tile) => {
        this.updateColorMap(tile, undefined)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.hexCenters.length === 0 && Object.keys(this.state.colorMap).length !== 0) {
            this.setState({colorMap: {}})
        }
    }

    render() {

        return this.props.hexCenters.map((hexInfo) => {

            const tile = hexInfo.hex.vector

            return (<HexTile hexSize={this.props.hexSize} center={hexInfo.center}
                             fill={this.state.colorMap[tile.toString()] || this.props.fill}
                             onClick={this.props.onClick ? () => this.props.onClick(tile) : undefined}
                             onHover={() => this.mouseHoverEvent(tile)}
                             onLeave={() => this.mouseLeaveEvent(tile)}
                             key={tile}/>)
        })
    }

}


class HexTile extends React.Component {

    constructor(props) {
        super(props);

        this.lineColor = 'red'
        this.toggleColor = 'black'
        this.fillColor = 'transparent'
        this.strokeWidth = 1

    }

    getHexCornerCords() {
        let points = ''
        for (let i = 0; i < 6; i++) {
            const {x, y} = this.getHexCornerCord(i)
            points += x + ',' + y + ' '
        }
        return points
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

    render() {
        return (
            <polygon points={this.getHexCornerCords()} stroke={this.lineColor} fill={this.props.fill || this.fillColor}
                     strokeWidth={this.strokeWidth}
                     onClick={this.props.onClick}
                     onMouseEnter={this.props.onHover}
                     onMouseLeave={this.props.onLeave}
            />
        )
    }
}

export {HexGrid as default}