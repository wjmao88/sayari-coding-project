
import styled from 'styled-components';
import { theme, ThemeKey } from 'app/styles/theme';

const Button = styled.button<{ color: ThemeKey }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: ${({ color }) => theme[color]};
  color: ${theme.light};
  border: none;
  
  &:hover, &:focus {
    box-shadow: 0px 8px 15px ${({ color }) => theme[color]};
  }
`;

export default Button;