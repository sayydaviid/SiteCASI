// src/layout/Header/Header.jsx

import React, { useState, useRef } from 'react';
import {
  HeaderContainer,
  LogoContainer,
  Nav,
  NavItem,
  NavLink,
  ShopButton,
  DropdownMenu,
  DropdownItem,
  Underline,
  Arrow
} from './header.styles';
import logo from '../../assets/images/ada-branca.png';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [underline, setUnderline] = useState({ left: 0, width: 0, visible: false });
  const navRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  // calcula underline
  const handleMouseEnterNavItem = e => {
    const navRect  = navRef.current.getBoundingClientRect();
    const itemRect = e.currentTarget.getBoundingClientRect();
    setUnderline({
      left:  itemRect.left - navRect.left,
      width: itemRect.width,
      visible: true
    });
  };

  // abre imediatamente
  const handleNavItemMouseEnter = e => {
    clearTimeout(closeTimeoutRef.current);
    setIsDropdownOpen(true);
    handleMouseEnterNavItem(e);
  };

  // inicia timeout para fechar
  const handleNavItemMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
      setUnderline(u => ({ ...u, visible: false }));
    }, 150);
  };

  // se entrar no dropdown, cancela fechamento
  const handleDropdownMouseEnter = () => {
    clearTimeout(closeTimeoutRef.current);
  };

  // se sair do dropdown, fecha imediatamente
  const handleDropdownMouseLeave = () => {
    setIsDropdownOpen(false);
    setUnderline(u => ({ ...u, visible: false }));
  };

  return (
    <HeaderContainer>
      {/*
        Renderiza LogoContainer COMO <a> para manter o flex e
        ao mesmo tempo criar a âncora para #home
      */}
      <LogoContainer
        as="a"
        href="#home"
        style={{ textDecoration: 'none' }}
      >
        <img src={logo} alt="Logo Ada" />
        <span>CASI UFPA</span>
      </LogoContainer>

      <Nav ref={navRef}>
        {/* NavItem CASI */}
        <NavItem
          onMouseEnter={handleNavItemMouseEnter}
          onMouseLeave={handleNavItemMouseLeave}
        >
          <NavLink href="#">
            CASI&nbsp;<Arrow $open={isDropdownOpen}>▾</Arrow>
          </NavLink>

          <DropdownMenu
            $open={isDropdownOpen}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <DropdownItem href="#sobre">Sobre</DropdownItem>
            <DropdownItem href="#gestao-atual" $hasDivider>
              Gestão Atual
            </DropdownItem>
          </DropdownMenu>
        </NavItem>

        {/* Outros itens: apenas underline e fecha dropdown */}
        <NavItem
          onMouseEnter={e => {
            handleMouseEnterNavItem(e);
            setIsDropdownOpen(false);
          }}
        >
          <NavLink href="#noticias">Notícias</NavLink>
        </NavItem>

        <NavItem
          onMouseEnter={e => {
            handleMouseEnterNavItem(e);
            setIsDropdownOpen(false);
          }}
        >
          <NavLink href="#projetos">Projetos</NavLink>
        </NavItem>

        <NavItem
          onMouseEnter={e => {
            handleMouseEnterNavItem(e);
            setIsDropdownOpen(false);
          }}
        >
          <NavLink href="#publicacoes">Publicações</NavLink>
        </NavItem>

        {/* Loja */}
        <ShopButton
          href="#loja"
          onMouseEnter={() => {
            setIsDropdownOpen(false);
            setUnderline(u => ({ ...u, visible: false }));
          }}
        >
          LOJA
        </ShopButton>

        {/* Underline animada */}
        <Underline
          $left={underline.left}
          $width={underline.width}
          $visible={underline.visible}
        />
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
