
import React, { useState, useEffect } from 'react';
import { Graph } from 'app/api/all';
import * as d3 from 'd3';
import { find } from 'lodash';
import { 
  LinkDatum,
  NodeDatum
} from 'app/utils/visual';

//some times along away I made a detour to see if I can just use 
//d3 as the layout engine and still have react to all the rendering
//but react batches updates so the screen would lag and jitter
//I could probably do some hacky things to get around it
//or I could just do d3 like (I think) I'm supposed to.
const GraphViewer: React.FC<{
  graph: Graph,
  svgSize:number,
  nodeSize:number,
  nodeGap:number,
}> = ({
  graph,
  svgSize,
  nodeSize,
  nodeGap,
}) => {
  const [ datums, setDatums ] = useState<{
    nodeDatums: NodeDatum[],
    linkDatums: LinkDatum[],
  }>({ nodeDatums: [], linkDatums: [] });

  useEffect(() => {
    datums.nodeDatums = graph.nodes.map(node => {
      return { ...node }
    });
    datums.linkDatums = graph.relationships.map((relationship) => {
      return {
          ...relationship,
        source: find(datums.nodeDatums, n => n.id === relationship.src_id)!,
        target: find(datums.nodeDatums, n => n.id === relationship.dst_id)!,
      };
    });

    d3.forceSimulation(datums.nodeDatums)
      .force('link', d3.forceLink(datums.linkDatums))
      .force('charge', d3.forceManyBody().strength(-nodeSize * 5))
      .force('collide', d3.forceCollide(nodeSize + nodeGap))
      .force('center', d3.forceCenter(1000/2, 1000/2))
      .on('tick', () => {
        setDatums(datums);
      });
  }, [ graph ]);

  return (
    <svg 
      style={{  border: '5px solid blue' }}
      viewBox={`0,0,${1000},${1000}`}
      width={svgSize}
      height={svgSize}
    >
      <g className="links">
        { datums.linkDatums.map(linkDatum => (
          <line 
            key={linkDatum.index}
            x1={linkDatum.source.x}
            y1={linkDatum.source.y}
            x2={linkDatum.target.x}
            y2={linkDatum.target.y}
          ></line>
        ))}
      </g>
      <g className="nodes">
        { datums.nodeDatums.map(nodeDatum => (
          <circle 
            key={nodeDatum.id}
            cx={nodeDatum.x}
            cy={nodeDatum.y}
            r={nodeSize}
          ></circle>
        ))}
      </g>
    </svg>
  );
};

export default GraphViewer;