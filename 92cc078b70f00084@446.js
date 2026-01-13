function _1(md){return(
md`# Collapsible Radial Tidy Tree

Click a black node to expand or collapse [the tree](/@d3/tidy-tree).

Based on Mike Bostock's work: https://observablehq.com/@d3/collapsible-tree
I have modified his program so that it works on Radial Tidy Tree. It also has slow animation functionality working. Just click a black node while pressing the altKey("option" key for Mac OS-X).`
)}

function _chart(d3,data,width,tree,radial)
{
  const root = d3.hierarchy(data);

  root.x0 = 0;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
  });

  const svg = d3
    .create("svg")
    .style("font", "10px sans-serif")
    .style("user-select", "none");

  const g = svg
    .append("g")
    .attr("transform", () => `translate(${width / 2}, ${width / 2})`); // !important

  const gLink = g
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5);

  const gNode = g
    .append("g")
    .attr("cursor", "pointer")
    .attr("pointer-events", "all");

  function update(event, source) {
    const duration = event && event.altKey ? 2500 : 250;
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    tree(root);

    const transition = svg
      .transition()
      .duration(duration)
      .attr("viewBox", [0, 0, width, width]);
    //.tween(
    //  "resize",
    //  window.ResizeObserver ? null : () => () => svg.dispatch("toggle")
    //);

    // Update the nodes…
    const node = gNode.selectAll("g").data(nodes, (d) => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node
      .enter()
      .append("g")
      .attr(
        "transform",
        (d) => `
            rotate(${(source.x0 * 180) / Math.PI - 90})
            translate(${source.y0}, 0)
      `
      )
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .on("click", (event, d) => {
        d.children = d.children ? null : d._children;
        update(event, d);
      });

    nodeEnter
      .append("circle")
      .attr("r", 2.5)
      .attr("fill", (d) => (d._children ? "#555" : "#999"))
      .attr("stroke-width", 10);

    nodeEnter
      .append("text")
      .attr(
        "transform",
        (d) => `
          rotate(${d.x >= Math.PI ? 180 : 0})
      `
      )
      .attr("dy", "0.31em")
      .attr("x", (d) => (d.x < Math.PI === !d.children ? 6 : -6))
      .attr("text-anchor", (d) =>
        d.x < Math.PI === !d.children ? "start" : "end"
      )
      .text((d) => d.data.name)
      .clone(true)
      .lower()
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .attr("stroke", "white");

    // Transition nodes to their new position.
    const nodeUpdate = node
      .merge(nodeEnter)
      .transition(transition)
      .attr(
        "transform",
        (d) => `
          rotate(${(d.x * 180) / Math.PI - 90}) 
          translate(${d.y}, 0)`
      )
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node
      .exit()
      .transition(transition)
      .remove()
      .attr(
        "transform",
        (d) => `
          rotate(${(source.x * 180) / Math.PI - 90}) 
          translate(${source.y}, 0)`
      )
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path").data(links, (d) => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link
      .enter()
      .append("path")
      .attr("d", (d) => {
        const o = { x: source.x0, y: source.y0 };
        return radial({ source: o, target: o });
      });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition).attr("d", radial);

    // Transition exiting nodes to the parent's new position.
    link
      .exit()
      .transition(transition)
      .remove()
      .attr("d", (d) => {
        const o = { x: source.x, y: source.y };
        return radial({ source: o, target: o });
      });

    // Stash the old positions for transition.
    root.eachBefore((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
  update(null, root);

  return svg.node();
}


function _radial(d3){return(
d3.linkRadial()
    .angle(d => d.x)
    .radius(d => d.y)
)}

function _tree(d3,radius){return(
d3
  .tree()
  .size([2 * Math.PI, radius / 1.2])
  .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)
)}

function _data(FileAttachment){return(
FileAttachment("e65374209781891f37dea1e7a6e1c5e020a3009b8aedf113b4c80942018887a1176ad4945cf14444603ff91d3da371b3b0d72419fa8d2ee0f6e815732475d5de.json").json()
)}

function _radius(width){return(
width / 2
)}

function _d3(require){return(
require("d3@7")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["e65374209781891f37dea1e7a6e1c5e020a3009b8aedf113b4c80942018887a1176ad4945cf14444603ff91d3da371b3b0d72419fa8d2ee0f6e815732475d5de.json", {url: new URL("./files/b907033b83bdcaf8c3abc800465fc9ba0216b692c87a030bd4c20586b23010a7803b54082056f1ee95536114977d9c6d24253bef2b559f10ad3aba0558e4eb0d.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["d3","data","width","tree","radial"], _chart);
  main.variable(observer("radial")).define("radial", ["d3"], _radial);
  main.variable(observer("tree")).define("tree", ["d3","radius"], _tree);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("radius")).define("radius", ["width"], _radius);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
