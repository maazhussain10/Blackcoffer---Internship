import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export function PieChart(props) {
    const { data, outerRadius, innerRadius } = props;
    const ref = useRef();

    const margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
    };

    const width = 2 * outerRadius + margin.left + margin.right;
    const height = 2 * outerRadius + margin.top + margin.bottom;
    const colorScale = d3
        .scaleSequential()
        .interpolator(d3.interpolateCool)
        .domain([0, data.length]);

    useEffect(() => {
        drawChart();
    }, [data]);

    function drawChart() {
        // Remove the old svg
        d3.select(ref.current).select("svg").remove();

        // Create new svg
        const svg = d3
            .select(ref.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        var pie = d3.pie().value(function (d) {
            return d.count;
        });

        const arcGenerator = d3
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const pieGenerator = d3
            .pie()
            .padAngle(0)
            .value((d) => d.count);

        const arc = svg.selectAll().data(pieGenerator(data)).enter();

        // Append arcs
        arc.append("path")
            .attr("d", arcGenerator)
            .style("fill", (_, i) => colorScale(i))
            .style("stroke", "#ffffff")
            .style("stroke-width", 2);

        // Append text labels
        arc.append("text")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .text((d) => d.data._id[0])
            .style("fill", (_, i) => colorScale(data.length - i))
            .attr("transform", (d) => {
                const [x, y] = arcGenerator.centroid(d);
                return `translate(${x}, ${y})`;
            });
    }

    return (
            <div ref={ref}> </div>
    );
}
