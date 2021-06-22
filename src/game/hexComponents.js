import React from 'react'
import Map from "./hexaboard";

class HexGrid extends React.Component {

    constructor(props) {
        super(props);
        this.hexSize = 50
        this.hexOrigin = {x: 100, y: 130}
        this.dimensions = {rows: 20, columns: 30}
        this.canvasSize = {
            canvasWidth: this.dimensions.columns * this.hexSize * 2,
            canvasHeight: this.dimensions.rows * this.hexSize * 2
        }

        this.state = {
            radius: 3,
            hexSize: 50
        }
    }


    render() {

        const map = new Map()
        map.hexagon(this.state.radius);

        let hexes = [];
        for (let hexCor of map.m) {
            const center = map.layout.hexToPixel(hexCor);
            hexes.push(<HexTile hexSize={this.state.hexSize} center={center}
            key={hexCor}/>);
            console.log(center);
        }

        const hexWidth = 50 * 2;
        const widthInSides = Math.sqrt(3)
        const totalWidthInSides = (this.state.radius * 2 + 1) * widthInSides
        const totalWidth = totalWidthInSides * this.state.hexSize;
        const totalHeightInSides = this.state.radius * 3 + 2;
        const totalHeight = totalHeightInSides * this.state.hexSize;

        return (
            <svg width={totalWidth} height={totalHeight}
                 fill={"transparent"} stroke={"purple"} strokeWidth={1}>
                {hexes}
            </svg>
        )
    }

}

class HexTile extends React.Component {

    constructor(props) {
        super(props);

        this.height = props.hexSize * 2;
        this.width = props.hexSize * Math.sqrt(3);

        this.state = {
            color: 'red'
        }

    }

    getHexCornerCords() {
        let points = [0, 1, 2, 3, 4, 5].map((i) => this.getHexCornerCord(i))
        return points
    }

    getHexCornerCord(i) {
        const angle_deg = 60 * i - 30;
        const angle_rad = Math.PI / 180 * angle_deg;

        let x = this.props.center.x + this.props.hexSize * Math.cos(angle_rad);
        let y = this.props.center.y + this.props.hexSize * Math.sin(angle_rad);
        return this.Point(x, y);
    }

    Point(x, y) {
        return {x: x, y: y}
    }

    render() {
        let points = '';
        for (let point of this.getHexCornerCords()) {
            points += point.x + ',' + point.y + ' ';
        }

        return (
            <polygon points={points} stroke={this.state.color}
                     onClick={() => this.setState({color: 'blue'})}/>
        )
    }
}

export {HexGrid as default}