
import styled from 'styled-components';

//this is kind of my favorite thing
//I used it for everything in my old company. 
const FlexRow = styled.div<{ size: string }>`
  display: flex;
  align-items: center;
  margin: -${({ size }) => size};
  > * {
    margin: ${({ size }) => size};
  }
`;

export default FlexRow;