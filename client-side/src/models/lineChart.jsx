import React from "react";
import * as d3 from "d3";
import Axis from "./axis.jsx";

const LineChart = (props) => {
    const { data } = props;
    const xAccessor = (d) => d._id[0];
    const yAccessor = (d) => d.count;

    const xScale = d3
        .scaleBand()
        .range([0, props.width - props.left - props.right])
        .domain(data.map((d) => d._id[0]))
        .padding(0.1);
    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, yAccessor))
        .range([400, 0]);
    const lineGenerator = d3
        .line()
        .x((d) => xScale(xAccessor(d)))
        .y((d) => yScale(yAccessor(d)));

    return (
        <svg width={800} height={600}>
            <g transform={`translate(50, 50)`}>
                <path
                    d={lineGenerator(data)}
                    fill="transparent"
                    stroke="#13aa52"
                />
                <Axis x={0} y={0} scale={yScale} type="Left" />
                <Axis x={0} y={400} scale={xScale} type="Bottom" />
            </g>
        </svg>
    );
};

export default LineChart;
