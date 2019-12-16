
import styled from 'styled-components';

//basically a container that scrolls both ways
//the sizes are kinda arbitray
//I just don't want it to be too big to scroll
const GraphContainer = styled.div`
  display: flex;
  justify-content: center;
  overflow: scroll;
  height: 30rem;
  width: 100%;
  max-height: 90vh;
  border: 1px solid black;
`;

export default GraphContainer;