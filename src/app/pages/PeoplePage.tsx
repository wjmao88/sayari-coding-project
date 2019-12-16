import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import PageAlertsContext from 'app/landmarks/PageAlertsContext';
import GraphViewer from 'app/components/GraphViewer';
import { fetchGraph, Graph, GraphNode } from 'app/api/all';
import LoadingIndicator from 'app/components/widgets/LoadingIndicator';
import GraphContainer from 'app/components/GraphContainer';
import Button from 'app/components/widgets/Button';
import FlexRow from 'app/components/widgets/FlexRow';
import DataTable from 'app/components/DataTable';
import { traverseGraph } from 'app/utils/graph';
import FocusNodePanel from 'app/components/FocusNodePanel';

const PeoplePage = () => {
  const { alertsFetched, alerts, noitifyAlertsViewed } = useContext(PageAlertsContext);

  const [ loading, setLoading ] = useState<boolean>(false);
  const [ graph, setGraph ] = useState<Graph | null>(null);

  //normally, update would mean fetch again to get udpated graph
  //but for this its just either getting the same data back again
  //or get a new randomly generated graph
  const updatePeopleGraph = useCallback((random) => {
    setLoading(true);
    fetchGraph(random).then((graph) => {
      setLoading(false);
      setGraph(graph);
      //notify that someone looked at alerts
      //so the number should reset to 0 then count up again
      noitifyAlertsViewed('people');
    });
  }, []);

  useEffect(() => { if (alertsFetched) { updatePeopleGraph(false) } }, [alertsFetched])

  //I want to keep everything that controls the graph outside of the graph
  //so the grap itself (GraphViewer) can only concern about drawing the svg
  //and I can do the controls however I want, e.g. a separate controls bar
  //or as absolutely positioned buttons in the GraphContainer
  const [ nodeSize, setNodeSize ] = useState(15);
  const [ svgSizeMult, setSvgSizeMult ] = useState(80);
  const [ focusNode, setFocusNode ] = useState<GraphNode | null>(null);
  const [ focusDepth, setFocusDepth ] = useState(1);

  const displayGraph = useMemo(() => {
    if (!focusNode) {
      return graph;
    } else if (graph) {
      //this will start from the focus node and traverse 
      //up to N depth along edges to get a sub-graph
      //its not the kind of traverse that gets you a node of graphs.
      return traverseGraph(graph, focusNode, focusDepth);
    }
  }, [ graph, focusNode, focusDepth ]);

  return (
    <div style={{ padding: '0.5rem' }}>
      <h1>
        PeoplePage ({ alerts.people } updates)
      </h1>
      <FlexRow size="0.5em" style={{ padding: '0.5em' }}>
        <Button color="primary" onClick={() => updatePeopleGraph(false)}>Ues Set Data</Button>
        <Button color="primary" onClick={() => updatePeopleGraph(true)}>Use Random Data</Button>
      </FlexRow>
      <FlexRow size="0.5em" style={{ padding: '0.5em' }}>
        <Button color="accent" onClick={() => setNodeSize(nodeSize + 5)}>Zoom In</Button>
        <Button color="accent" onClick={() => setNodeSize(Math.max(nodeSize - 5, 5))}>Zoom Out</Button>
        <Button color="accent" onClick={() => setSvgSizeMult(Math.max(svgSizeMult - 5, 10))}>Smaller SVG</Button>
        <Button color="accent" onClick={() => setSvgSizeMult(svgSizeMult + 5)}>Bigger SVG</Button>
      </FlexRow>

      { loading && <LoadingIndicator />}

      { graph && displayGraph && focusNode &&
        <FocusNodePanel 
          focusNode={focusNode}
          setFocusNode={setFocusNode}
          focusDepth={focusDepth}
          setFocusDepth={setFocusDepth}
          canFocusDeeper={graph.nodes.length > displayGraph.nodes.length}
        />
      }

      { !loading && displayGraph && <>
        <GraphContainer >
          <GraphViewer
            graph={displayGraph}
            svgSize={nodeSize * svgSizeMult}
            nodeSize={nodeSize}
            edgeSize={30}
          />
        </GraphContainer>
        <DataTable 
          graph={displayGraph} 
          onFocus={(node: GraphNode) => { setFocusNode(node) }}
        />
      </> }
    </div>
  );
};

export default PeoplePage;