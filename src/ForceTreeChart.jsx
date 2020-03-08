import React, { useRef, useEffect } from "react";
import { select, hierarchy, forceSimulation, forceCenter, forceManyBody, forceCollide,
    mouse, forceX, forceY, forceRadial } from "d3";
// scaleBand for ordinal data like 1,2,3,4,5, scaleLinear for continuous data like 6.37, 1.333, etc
import useResizeObserver from "./useResizeObserver.js";


function ForceTreeChart({ data }) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    // wrapperRef is a div surrounding the svg because svg won't give
    // true dimensions in useResizeObserver
    const dimensions = useResizeObserver(wrapperRef);

    // called as soon as DOM is rendered, then every time data or dimensions change
    useEffect(() => {
        if (!dimensions) return;
        const {width, height} = dimensions;
        const svg = select(svgRef.current);

        // starts the nodes in the center
        svg.attr('viewBox', [-width/2, -height/2, width, height]);

        const root = hierarchy(data);
        const nodeData = root.descendants();
        const linkData = root.links();

        const simulation = forceSimulation(nodeData)
            // .alphaTarget(0.2)
            // .alphaMin(0.5)  // default is .001

            // .force("center", forceCenter(width/2, height/2 ))
            .force("charge", forceManyBody().strength(-30)) // negative is repulsion
            .force("collide", forceCollide(30)) // min distance to keep apart
            .on('tick', () => {
                
                // if you change the 'center' with the viewBox attr, you must adjust
                // your manually positioned elements as seen below
                svg
                    .selectAll(".alpha")
                    .data([data])
                    .join("text")
                    .attr("class", "alpha")
                    .text(simulation.alpha().toFixed(2))
                    .attr("x", -width / 2 + 10)
                    .attr("y", -height / 2 + 25);

                svg
                    .selectAll(".link")
                    .data(linkData)
                    .join("line")
                    .attr("class", "link")
                    .attr("stroke", "black")
                    .attr("fill", "none")
                    .attr("x1", link => link.source.x)
                    .attr("y1", link => link.source.y)
                    .attr("x2", link => link.target.x)
                    .attr("y2", link => link.target.y);

                svg
                    .selectAll(".node")
                    .data(nodeData)
                    .join("circle")
                    .attr("class", "node")
                    .attr("r", 4)
                    .attr("cx", node => node.x)
                    .attr("cy", node => node.y);

                svg
                    .selectAll(".label")
                    .data(nodeData)
                    .join("text")
                    .attr("class", "label")
                    .attr("text-anchor", "middle")
                    .attr("font-size", 20)
                    .text(node => node.data.name)
                    .attr("x", node => node.x)
                    .attr("y", node => node.y);
            });

        svg.on('mousemove', () => {
            const [x,y] = mouse(svgRef.current);
            simulation
                .force('x', forceX(x).strength(node => 0.2 + node.depth * .15))
                .force('y', forceY(y).strength(node => 0.2 + node.depth * .15));
        })

        svg.on('click', () => {
            const [x,y] = mouse(svgRef.current);
            simulation
                .alpha(.5)
                .restart()
                .force('orbit', forceRadial(100, x, y).strength(0.8))

            svg
                .selectAll('.orbit')
                .data([data])
                .join('circle')
                .attr('class','orbit')
                .attr('stroke','green')
                .attr('fill','none')
                .attr('r','100')
                .attr('cx',x)
                .attr('cy',y)
        })

    }, [data, dimensions]);

    return (
        <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
            <svg ref={svgRef}>
            </svg>
        </div>
    );
}

export default ForceTreeChart;