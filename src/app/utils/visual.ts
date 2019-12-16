
//All d3 related stuff is bound to this file and should never get out.

//d3 doesn't have a default
//alternatively, the `synthetic-default-import` plugin 
//would allow just `import d3 from 'd3';`
import * as d3 from 'd3';

import { GraphNode, GraphRelationship, Graph } from 'app/api/all';
import { find, merge, groupBy, flatMap, map } from 'lodash';
import { theme } from 'app/styles/theme';

export type NodeDatum = d3.SimulationNodeDatum & GraphNode;
export type LinkDatum = d3.SimulationLinkDatum<NodeDatum> & GraphRelationship & {
  //declare that we are using direct object linking
  //so that typescript can always expect them to be datums
  source: NodeDatum,
  target: NodeDatum,
  types: (LinkDatum['type'])[]
};
export type NodesSelection<TE extends SVGElement = SVGGElement> = 
  d3.Selection<TE, NodeDatum, any, any>;
export type LinksSelection<TE extends SVGElement = SVGGElement> = 
  d3.Selection<TE, LinkDatum, any, any>;

export const styleSvg = (
  d3Svg:  d3.Selection<SVGElement, any, any, any>, 
  svgSize: number
) => {
  d3Svg
    .attr('viewBox', `0,0,${svgSize},${svgSize}`)
    .attr('width', svgSize)
    .attr('height', svgSize);
};

export const styleNodes = (d3Nodes: NodesSelection, nodeSize: number) => {
  //I thought d3 would know how to deal with it since the signature is like 
  //d3.Selection<Element, Datum, ParentElement, ParentDatum>
  //but it doesn't know to use parent datum type if a child one isn't specified
  //this makes it understand it.
  (d3Nodes.selectAll('circle') as NodesSelection<SVGCircleElement>)
    .attr('r', nodeSize)
    .attr('fill', d => 
      d.type === 'PERSON'? theme.person : 
      d.type === 'COMPANY'? theme.company : 
      ''
    )
    .attr('stroke', 'lightgray');

  d3Nodes
    .selectAll('text.label')
    .attr('stroke', 'white')
    .attr('fill', 'white')
    .attr('font-size', nodeSize * 1.5)
    .attr('alignment-baseline', 'middle')
    .attr('dy', nodeSize*1.5/10)
    .attr('text-anchor', 'middle');

  d3Nodes
    .selectAll('g.details')
    .attr('visibility', 'hidden');

  (d3Nodes.selectAll('g.details rect') as NodesSelection<SVGCircleElement>)
    .attr('fill', theme.accent)
    //svg doesn't have good support for line breaking
    //so I'm kinda cheating here to just make it big
    .attr('width', '30rem') 
    .attr('height', d => d.addresses.length * 13 + 36);

  d3Nodes
    .selectAll('g.details .name')
    .attr('stroke', 'white')
    .attr('fill', 'white')
    .attr('font-size', '1rem')
    .attr('dy', '1.2rem')
    .attr('dx', '0.5rem');

  d3Nodes
    .selectAll('g.details .address')
    .attr('stroke', 'white')
    .attr('fill', 'white')
    .attr('font-size', '0.8rem')
    .attr('dx', '0.5rem');
};

export const styleLinks = (
  d3Links: LinksSelection, 
  nodeSize: number
) => {
  d3Links
    .selectAll('line')
    .attr('stroke-width', 2)
    .attr('stroke-opacity', 0.6)
    .attr('stroke', 'tomato');
  
  d3Links
    .selectAll('text')
    .attr('font-size', Math.max(nodeSize/2, 12))
    .attr('text-anchor', 'middle');
};

export const createSimulation = (
  nodeDatums: NodeDatum[], 
  linkDatums: LinkDatum[], 
  svgSize: number,
  nodeSize: number,
  edgeSize: number,
  onTick: () => void
) => {
  return d3.forceSimulation(nodeDatums)
    .force('link', d3.forceLink(linkDatums))
    //these are some magic numbers I came up with by hand tuning
    .force('charge', d3.forceManyBody().strength(-nodeSize * 7))
    .force('collide', d3.forceCollide(nodeSize * 3))
    .force('center', d3.forceCenter(svgSize/2, svgSize/2))
    .on('tick', onTick);
} 

export const createDrag = (
  simulation: d3.Simulation<NodeDatum, LinkDatum>,
  nodeSize: number
) => {
  return d3.drag<SVGGElement, NodeDatum>()
    .on('start', () => {
      if (!d3.event.active) {
        simulation.alphaTarget(0.5).restart();
      }
    })
    .on('drag', d => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    })
    .on('end', function(d){
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
      d.x = d.fx!;
      d.y = d.fy!;

      //alternatively, I could just draw them and toggle them
      //just like the details panel
      d3.select(this).selectAll('text.unpin').data([1]).enter()
        .append('text')
        .attr('class', 'unpin')
        .text('UNPIN')
        .attr('stroke', theme.primary)
        .attr('fill', theme.primary)
        .attr('dy', -nodeSize + 2)
        .on('click', () => {
          d.fx = null;
          d.fy = null;
          d3.select(this).select('text.unpin').data([]).exit().remove();
        })
        .attr('text-anchor', 'middle');
    });
}

export const renderGraphToSVG = (
  graph: Graph,
  svgElement: SVGElement,
  svgSize:number,
  nodeSize:number,
  edgeSize:number,
) => {

  const svg = d3.select(svgElement);
  styleSvg(svg, svgSize);

  let nodesSelection: NodesSelection = svg.select('g.nodes').selectAll('g.node');
  let linksSelection: LinksSelection = svg.select('g.links').selectAll('g.link');

  //try to use existing datums as much as possible, if exists.
  //doing this dance because if the datums doesn't change 
  //(i.e part of enter/exit)
  //then d3 doesn't update the internal data to new data at all
  //this means that we must be careful in keeping all references
  const existingNodeDatums = nodesSelection.data() as NodeDatum[];
  const nodeDatums: NodeDatum[] = graph.nodes.map(node => {
    const existing = find(existingNodeDatums, n => n.id === node.id);
    return merge(existing || {}, node);
  });

  const existingLinkDatums = linksSelection.data() as LinkDatum[];

  //grouping links by src and dst, since multiple links can exist
  //between nodes for different types. 
  //This is only for visualization,
  //so it is done here to not affect data elsewhere
  const aggregatedLinks = groupBy(graph.relationships, r => {
    return `${r.src_id}->${r.dst_id}`;
  });
  const linkDatums: LinkDatum[] = map(aggregatedLinks, (relationships) => {
    const types = relationships.map(r => r.type);
    const positions = flatMap(relationships, r => r.positions);
    const relationship = {
      ...relationships[0],
      types,
      positions,
    }
    const existing = find(existingLinkDatums, r => 
      r.src_id === relationship.src_id && 
      r.dst_id === relationship.dst_id
    );

    if (existing) {
      return merge(existing, relationship);
    } else {
      return {
        ...relationship,
        source: find(nodeDatums, n => n.id === relationship.src_id)!,
        target: find(nodeDatums, n => n.id === relationship.dst_id)!,
      };
    }
  });

  nodesSelection = nodesSelection.data(nodeDatums, n => n.id.toString());
  linksSelection = linksSelection.data(linkDatums, l => `${l.src_id}->${l.dst_id}(${l.type})`);

  const newNodes = nodesSelection
    .enter()
    .append('g')
    .attr('class', d => `node ${d.type}`)

  newNodes.append('circle');
  newNodes.append('text').attr('class', 'label').text(d => d.label[0]);

  const panel = newNodes.append('g').attr('class', 'details');
  panel.append('rect');
  panel.append('text').attr('class', 'name').text(d => `${d.label} (${d.type})`);
  panel.each(function(d) {
    const thisPanel = d3.select(this);
    d.addresses.forEach((address, index) => {
      thisPanel.append('text')
        .attr('class', 'address')
        .text(address)
        .attr('dy', 36 + index * 12);
    });
  });

  newNodes
    .on('mouseenter', function(){
      d3.select(this).selectAll('g.details').attr('visibility', 'visible')
    })
    .on('mouseleave', function(){
      d3.select(this).selectAll('g.details').attr('visibility', 'hidden')
    });

  const newLinks = linksSelection.enter()
    .append('g')
    .attr('class', d => `link ${d.type}`)
  
  newLinks.append('line');
  newLinks.append('text').attr('class', 'label').text(d => {
    if (d.types.length === 1) {
      return d.types[0];
    } else {
      return `${d.types.length} connections`;
    }
  });
  
  nodesSelection = nodesSelection.merge(newNodes).merge(
    //d3 types have "remove" with datum type of unknown
    //which makes sense, since the datum for it is gone
    //but this causes issues with merge, which expects the specified type
    nodesSelection.exit().remove() as NodesSelection
  );
  linksSelection = linksSelection.merge(newLinks).merge(
    linksSelection.exit().remove() as LinksSelection
  );

  //I tried to make all styling code in these styling functions
  //to keep this main rendering function only adding/removing stuff
  //though some of styling have bleed to various places
  styleLinks(linksSelection, nodeSize);
  styleNodes(nodesSelection, nodeSize);

  const simulation = createSimulation(
    nodeDatums,
    linkDatums,
    svgSize,
    nodeSize,
    edgeSize,
    () => {
      (linksSelection.selectAll('line') as LinksSelection<SVGLineElement>)
        .attr('x1', d => d.source.x!)
        .attr('y1', d => d.source.y!)
        .attr('x2', d => d.target.x!)
        .attr('y2', d => d.target.y!);

      (linksSelection.selectAll('text') as LinksSelection<SVGTextElement>)
        .attr('x', d => (d.source.x! + d.target.x!)/2)
        .attr('y', d => (d.source.y! + d.target.y!)/2)
        //some trignometry to make text label for lines the same angle as the line
        .attr('transform', d => `rotate(
          ${Math.atan2(
            (d.target.y! - d.source.y!),
            (d.target.x! - d.source.x!)
          ) * 180/Math.PI}, 
          ${(d.source.x! + d.target.x!)/2}, 
          ${(d.source.y! + d.target.y!)/2}
        )`);

      nodesSelection
        .data(nodeDatums)
        .attr('transform', d => `translate(${d.x}, ${d.y})`)
    }
  );

  const drag = createDrag(simulation, nodeSize);
  nodesSelection.call(drag);
}