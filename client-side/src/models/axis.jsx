import React from "react";
import * as d3 from "d3";

class Axis extends React.Component {
    constructor() {
        super();
        this.gRef = React.createRef();
    }

    componentDidMount() {
        this.d3Render();
    }

    d3Render() {
        const { type } = this.props;

        d3.select(this.gRef.current).call(d3[`axis${type}`](this.props.scale));
    }
    getlabelPos() {
        const { type, scale } = this.props;
        console.log("A",scale.range(),type);
        switch (type) {
            case "Top":
                return { x: scale.range()[1] + 20, y: 0 };
            case "Right":
                return { x: 20, y: 0 };
            case "Bottom":
                return { x: scale.range()[1] + 25, y: 25 };
            case "Left":
                return { x: -25, y: 0 };
        }
    }

    render() {
        const { x, y } = this.props;
        return <g ref={this.gRef} transform={`translate(${x}, ${y})`} />;
    }
}

export default Axis;
