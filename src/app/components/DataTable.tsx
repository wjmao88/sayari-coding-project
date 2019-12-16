import React, { useState, useMemo } from 'react';
import { Graph, GraphNode } from 'app/api/all';
import FlexRow from './widgets/FlexRow';
import Button from './widgets/Button';
import { find, orderBy, uniq } from 'lodash';
import UList from './widgets/UList';
import { theme } from 'app/styles/theme';
import RoundButton from './widgets/RoundButton';
import Bullet from './widgets/Bullet';

type DataTableProps = { 
  graph: Graph,
  onFocus: (node: GraphNode) => void
};

const DataRow: React.FC<{node: GraphNode} & DataTableProps> = ({
  node,
  graph,
  onFocus,
}) => {
  const [ isOpen, setIsOpen ] = useState(false);
  const related = useMemo(() => {
    return graph.relationships.filter(r => {
      return r.src_id === node.id || r.dst_id === node.id;
    }).map(r => {
      const otherId = r.src_id === node.id? r.dst_id : r.src_id;
      return {
        ...r,
        otherNode: find(graph.nodes, { id: otherId })!
      };
    });
  }, [node, graph]);

  return (
    <div style={{ 
      border: `1px solid ${theme.primary}`, 
      padding: '0.5rem 1rem'
    }}>
      <FlexRow size="0.5rem">
        <RoundButton color="accent" onClick={() => setIsOpen(!isOpen)}>
          { isOpen? 'V' : '>' /* I don't have chevrons...this can do for now...*/}
        </RoundButton>
        <div>{node.label}</div>
        <div style={{ flexGrow: 1 }}>
          <Bullet color={node.type === 'COMPANY'? 'company' : 'person'}>
            {node.type}
          </Bullet>
        </div>
        <div>
          <Button 
            color="primary" 
            onClick={() => onFocus(node)}
          >Focus</Button>
        </div>
      </FlexRow>
      { isOpen && 
      /*
        not a lot of thought has gone into formatting this to be pretty
        just basic lists of stuff
      */
        <div>
          <hr/>
          <div>Addresses</div>
          <UList>
            { node.addresses.map(adrs => <li key={adrs}>{adrs}</li>) }
          </UList>
          <hr/>
          <div>Relationships</div>
          <UList>
            { orderBy(related, r => r.otherNode.label).map(({ otherNode, positions }) => (
              <li key={otherNode.id}>
                <FlexRow size="0.25em">
                  <div>{otherNode.label}</div>
                  <div>{positions.join(', ')}</div>
                </FlexRow>
              </li>
            )) }
          </UList>
        </div>
      }
    </div>
  );
};

const DataTable: React.FC<DataTableProps> = ({
  graph,
  onFocus,
}) => {
  const nodeTypes = useMemo(() => {
    return uniq(graph.nodes.map(n => n.type));
  }, [graph]);

  //using a negative here so I don't have to populate it
  const [ hiddenTypes, setHiddenTypes ] = useState<Record<string, boolean>>({});
  const [ searchString, setSearchString ] = useState<string>('');
  
  const displayNodes = useMemo(() => {
    //basic filtering. I could also add a sort that just adds a `orderBy`.
    return graph.nodes.filter(n => {
      return !hiddenTypes[n.type] && (
        !searchString || n.label.toLowerCase().match(searchString.toLowerCase())
      );
    });
  }, [graph, searchString, hiddenTypes]);

  return (
    <div>
      <FlexRow size="0.5rem">
        { nodeTypes.map(type => (
          <label key={type}>
            <input 
              type="checkbox" 
              checked={!hiddenTypes[type]} 
              onChange={() => {
                setHiddenTypes({
                  ...hiddenTypes,
                  [type]: !hiddenTypes[type]
                })
              }}
            />
            <span>Showing {type}</span>
          </label>
        ))}
      </FlexRow>
      <FlexRow size="0.5rem">
        <label htmlFor="data-table-search">Search</label>
        <input 
          id="data-table-search"
          value={searchString} 
          onChange={e => setSearchString(e.target.value)}
        />
      </FlexRow>
      <UList>
        { displayNodes.map(node => (
          <li key={node.id} style={{ margin: '0.5rem 0'}}>
            <DataRow node={node} graph={graph} onFocus={onFocus} />
          </li>
        ))}
      </UList>
    </div>
  );
};

export default DataTable;