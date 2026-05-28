import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(10px);
  background: color-mix(in oklch, var(--surface-elevated), black 6%);
  border-bottom: 1px solid var(--border);

  @media (min-width: 1100px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 260px;
    border-right: 1px solid var(--border);
    border-bottom: none;
  }
`;

const NavInner = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 0.8rem 1rem;

  @media (min-width: 1100px) {
    max-width: none;
    margin: 0;
    height: 100%;
    padding: 1.2rem 0.85rem;
    display: flex;
    flex-direction: column;
  }
`;

const Brand = styled(NavLink)`
  display: inline-block;
  margin-bottom: 0.75rem;
  color: var(--text-strong);
  text-decoration: none;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-shadow: 0 0 16px color-mix(in oklch, var(--brand-2), transparent 78%);

  @media (min-width: 1100px) {
    margin: 0 0 0.9rem;
  }
`;

const NavList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (min-width: 1100px) {
    display: grid;
    gap: 0.55rem;
  }
`;

const NavItem = styled.li`
  margin: 0;
`;

const StyledNavLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  min-height: 42px;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  border: 1px solid transparent;
  background: color-mix(in oklch, var(--surface-muted), black 8%);
  color: var(--text-default);
  text-decoration: none;

  &.active {
    background: linear-gradient(135deg, var(--brand), var(--brand-2));
    color: white;
    box-shadow: var(--shadow-sm);
  }

  &:hover {
    border-color: var(--border-strong);
    transform: translateY(-1px);
    box-shadow: 0 0 14px color-mix(in oklch, var(--brand-2), transparent 80%);
    transition: border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--focus-ring);
  }
`;

const Navigation = () => {
  return (
    <Nav>
      <NavInner>
        <Brand to="/">⚔️ D&D Command Board</Brand>
        <NavList>
          <NavItem>
            <StyledNavLink to="/">Dashboard</StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/character">Characters</StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/campaign">Campaigns</StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/encounters">Encounters</StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/combat">Combat</StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/dice">Dice Roller</StyledNavLink>
          </NavItem>
        </NavList>
      </NavInner>
    </Nav>
  );
};

export default Navigation;
