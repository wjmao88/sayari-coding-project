import React, { useContext } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { staticRoutes } from 'app/staticRoutes';
import { theme } from 'app/styles/theme';
import Bullet from 'app/components/widgets/Bullet';
import PageAlertsContext from './PageAlertsContext';
import Button from 'app/components/widgets/Button';
import FlexRow from 'app/components/widgets/FlexRow';

//there is no reuse for me to want to make a file for it
//and there are too many styles for me to want to inline it.
const StyledNav = styled.nav`
  background-color: ${theme.primary};
  a {
    color: white;
    &.active {
      background-color: ${theme.accent};
    }
    flex: 0 0 6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    text-decoration: none;
    margin-bottom: 0;
    &:hover {
      text-decoration: underline
    };
    
    > :last-child {
      margin-left: 0.25rem
    }
  }
`;

const Divider = styled.nav` 
  flex: 1 1 6rem;
  content: '&nbsp;'
`;

const NavBar = () => {
  const { alerts } = useContext(PageAlertsContext);
  return (
    <StyledNav>
      <FlexRow size="0.5rem">
        <NavLink to={staticRoutes.company}>
          Company
        </NavLink>
        <NavLink to={staticRoutes.people}>
          People
          { alerts.people > 0 && 
            <Bullet color="danger">{alerts.people}</Bullet>
          }
        </NavLink>
        <NavLink to={staticRoutes.violations}>
          Violations
          { alerts.violation > 0 && 
            <Bullet color="danger">{alerts.violation}</Bullet>
          }
        </NavLink>
        <NavLink to={staticRoutes.statistics}>
          Statistics
        </NavLink>

        <Divider />

        <NavLink to={staticRoutes.settings}>
          Settings
        </NavLink>
        <NavLink to={staticRoutes.profile}>
          Profile
        </NavLink>

        <Button 
          color="primary" 
          onClick={() => window.alert('You logged out. Yay.')}
        >
          Logout
        </Button>
      </FlexRow>
    </StyledNav>
  );
};

export default NavBar;