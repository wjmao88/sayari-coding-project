
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { Graph } from 'app/api/all';
import { 
  renderGraphToSVG
} from 'app/utils/visual';
import { theme } from 'app/styles/theme';

const GraphViewer: React.FC<{
  graph: Graph,
  svgSize:number,
  nodeSize:number,
  edgeSize:number,
}> = ({
  graph,
  svgSize,
  nodeSize,
  edgeSize,
}) => {

  const containerRef = useRef<SVGElement | null>(null);

  //using this to signal initial render of svg
  //because its not possible to watch a reference change with useEffect
  //and also I want updates other than initial render, so no useCallback.
  const [ rendered, setRendered ] = useState(false);

  const containerCB = useCallback<(n: SVGElement | null) => void>((
    containerElement
  ) => {
    containerRef.current = containerElement;
    setRendered(true);
  }, [ graph, svgSize ]);

  useEffect(() => {
    //the containerRef.current check is not necessary
    //but it makes typescript happy
    if (rendered && containerRef.current) {
      renderGraphToSVG(
        graph, 
        containerRef.current,
        svgSize, 
        nodeSize, 
        edgeSize,
      );
    }
  }, [ rendered, graph, svgSize, nodeSize, edgeSize ]);

  return (
    <svg 
      style={{  border: `5px solid ${theme.primary}` }}
      ref={containerCB}
      height={svgSize}
      width={svgSize}
    >
      <g className="links"></g>
      <g className="nodes"></g>
    </svg>
  );
};

export default GraphViewer;