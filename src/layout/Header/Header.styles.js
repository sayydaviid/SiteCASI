// src/layout/Header/header.styles.js

import styled from 'styled-components';

export const HeaderContainer = styled.header`
  width: 100%;
  background-color: #000;
  border-bottom: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 64px;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  img {
    height: 80px;
    margin-right: 0.1rem;
    align-self: flex-end;
    margin-bottom: -11px;
  }

  span {
    font-family: 'Newsreader', serif;
    color: #fff;
    font-size: 1.25rem;
    font-weight: bold;
    letter-spacing: 0.5px;
    line-height: 1;
  }
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  position: relative;
`;

export const NavItem = styled.div`
  position: relative;
  margin: 0 1rem;

  /* Expande a área de hover para cobrir o gap de 9px entre link e menu */
  &::after {
    content: '';
    position: absolute;
    bottom: -9px;
    left: 0;
    right: 0;
    height: 9px;
  }
`;

export const NavLink = styled.a`
  color: #fff;
  font-family: 'Inter', sans-serif;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;

  &:hover {
    opacity: 0.8;
  }
`;

export const Arrow = styled.span`
  display: inline-block;
  transition: transform 0.3s ease;
  /* usar o transient prop $open */
  transform: ${({ $open }) => ($open ? 'rotate(-180deg)' : 'rotate(0deg)')};
`;

export const ShopButton = styled.a`
  display: inline-block;
  background-color: #fff;
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  margin-left: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: scale(1.05);
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 9px);
  left: 0;
  background-color: #000;
  border-left: 1px solid #fff;
  border-right: 1px solid #fff;
  border-bottom: 1px solid #fff;
  min-width: 160px;
  z-index: 1000;

  /* agora usa $open em vez de open */
  display: ${({ $open }) => ($open ? 'block' : 'none')};
`;

export const DropdownItem = styled.a`
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 0.5rem 1rem;
  color: #fff;
  text-decoration: none;
  font-size: 0.95rem;
  cursor: pointer;

  /* agora usa $hasDivider em vez de hasDivider */
  border-top: ${({ $hasDivider }) => ($hasDivider ? '1px solid #fff' : 'none')};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const Underline = styled.span`
  position: absolute;
  bottom: 0;
  height: 2px;
  background-color: #fff;
  transition: left 0.3s ease, width 0.3s ease, opacity 0.3s ease;

  /* transient props para evitar vazamento */
  left: ${({ $left }) => $left}px;
  width: ${({ $width }) => $width}px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
`;
