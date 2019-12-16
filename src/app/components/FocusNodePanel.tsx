
import React, { useEffect, useRef } from 'react';
import { GraphNode } from 'app/api/all';
import Button from './widgets/Button';
import FlexRow from './widgets/FlexRow';

const FocusNodePanel: React.FC<{
  focusNode: GraphNode,
  setFocusNode: (n: GraphNode | null) => void,
  focusDepth: number,
  setFocusDepth: (d: number) => void,
  canFocusDeeper: boolean
}> = ({
  focusNode,
  setFocusNode,
  focusDepth,
  setFocusDepth,
  canFocusDeeper,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (divRef.current){
      window.scrollTo({
        top: divRef.current.getBoundingClientRect().top
      });
    }
  }, [focusNode])
  return (
    <div ref={divRef}>
      <hr/>
      <FlexRow size="0.5rem">
        <Button color="primary" onClick={() => setFocusNode(null)}>
          Unfocus
        </Button>
        <h2>{focusNode.label}</h2>
      </FlexRow>
      <FlexRow size="0.5rem">
        <Button color="accent" onClick={() => setFocusDepth(focusDepth - 1)}>
          Less Depth
        </Button>
        <div>{focusDepth}</div>
        { canFocusDeeper?
          <Button color="accent" disabled={!canFocusDeeper} onClick={() => setFocusDepth(focusDepth + 1)}>
            More Depth
          </Button>
          :
          /*
            this is me not wanting to style disabled buttons
            in retrospect I should have just used boostrap
          */
          <div>Showing entire graph</div>
        }
      </FlexRow>
      <hr/>
    </div>
  );
};

export default FocusNodePanel;