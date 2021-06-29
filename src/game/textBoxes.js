import React from 'react'


class ResponseArea extends React.Component {
    render() {

        const style = {
            position: "fixed",
            top: 0,
            left: 0,
            width: '100%',
            height:'100%',
            zIndex: 11,
        }

        const fillerBox = (
            <rect fill={'#F0F0F0'} fillOpacity={"50%"}
                  y={this.props.height} width={'100%'} height={'100%'} />
        )



        return (
            <div style={style}>
                <svg width={style.width} height={style.height}>
                    <TextBox height={this.props.height}
                             options={this.props.choices}
                             onChoice={this.props.onChoice}
                    />
                    {fillerBox}
                </svg>
            </div>
        )
    }
}


class TextBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentlySelected: [0, 0]
        }
    }


    render() {
        const strokeWidth = 10

        const textItems = this.props.options ? this.props.options.map((text, i) => {

            const row = i % 2 + 1
            const column = Math.floor(i / 2) + 1

            const x = 150 * column
            const y = 66 * row

            return (
                <TextItem text={text} x={x} y={y}
                          onClick={() => this.props.onChoice(text)}
                          key={text}
                />

            )
        }) : undefined

        return (
            <g id={"textBox"}>
                <g id={"textBox-background"}>
                    <rect fill={'#C0C0C0'} width={'100%'} height={this.props.height}/>
                    <rect fill={'#000000'} y={this.props.height - strokeWidth}
                          width={'100%'} height={strokeWidth}/>
                </g>
                <g id={"textBox-text"}>
                    <filter x={0} y={0} width={'100%'} height={'100%'} id={'textBgFilter'}>
                        <feFlood floodColor={'#D0D0D0'} opacity={'90%'} result={'bgFill'} />
                        <feBlend in={'SourceGraphic'} in2={'bgFill'} mode={'multiply'}/>
                    </filter>
                    {textItems}
                </g>
            </g>
        )
    }
}

class TextItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hover: false
        }
    }

    onTextHover = () => {
        this.setState({
            hover: true
        })
    }

    onTextLeave = () => {
        this.setState({
            hover: false
        })
    }

    render() {

        return (
                <text filter={this.state.hover ? 'url(#textBgFilter)' : undefined} x={this.props.x} y={this.props.y}
                      onMouseEnter={this.onTextHover} onMouseLeave={this.onTextLeave}
                      onClick={this.props.onClick}
                      style={{
                          fill: 'black',
                          userSelect: 'none',
                          font: "bold 20px serif",
                          fontFamily: 'monospace',
                      }}
                >
                    {this.props.text}
                </text>
        )
    }
}

export {ResponseArea, TextBox}