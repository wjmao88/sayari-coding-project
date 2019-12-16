import { GraphNode, Graph } from 'app/api/all';
import { uniqBy, uniqWith, keyBy, groupBy } from 'lodash';

//traverse the graph outwards from a single node
export const traverseGraph = (
  graph: Graph, 
  focusNode: GraphNode, 
  startDepth: number,
): Graph => {

  //these global maps are optimization I made over a direct recursion.
  //for the official data, it improves the performance for 4+ depth 
  //from several seconds to less than a second.
  const traversedNodes: Record<string, GraphNode> = {};
  const nodesById: Record<string, GraphNode> = keyBy(graph.nodes, n => n.id);
  const relBySrcId = groupBy(graph.relationships, r => r.src_id);
  const relByDstId = groupBy(graph.relationships, r => r.dst_id);

  const recursiveTraverseGraph = (node: GraphNode, depth: number): Graph => {
    if (depth === 0 || traversedNodes[node.id]) {
      return {
        nodes: [],
        relationships: [],
      }
    }

    const relationships = (relBySrcId[node.id] || []).concat(relByDstId[node.id] || []);
    
    const nodes = relationships.map(r => {
      const otherId = r.src_id === node.id? r.dst_id : r.src_id;
      return nodesById[otherId];
    });

    const subGraphs = nodes.map(node => recursiveTraverseGraph(node, depth - 1));
    
    return subGraphs.reduce((acc, subgraph) => {
      return {
        nodes: uniqBy(acc.nodes.concat(subgraph.nodes), (n) => n.id),
        relationships: uniqWith(
          acc.relationships.concat(subgraph.relationships), 
          (r1, r2) => 
            r1.src_id === r2.src_id && 
            r1.dst_id === r2.dst_id && 
            r1.type === r2.type
        ),
      }
    }, { nodes: nodes.concat(node), relationships });;
  }

  return recursiveTraverseGraph(focusNode, startDepth);
}