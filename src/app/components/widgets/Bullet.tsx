
import styled from 'styled-components';
import { theme, ThemeKey } from 'app/styles/theme';

const Bullet = styled.span<{ color: ThemeKey }>`
  font-size: 0.8em;
  border-radius: 0.5em;
  padding: 0.125em 0.25em;
  background-color: ${({ color }) => theme[color]};
  color: white;
`;

export default Bullet;