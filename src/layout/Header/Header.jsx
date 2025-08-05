import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
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

  // --- LÓGICA UNIFICADA ---

  // Função chamada quando o rato entra em QUALQUER item da navegação
  const handleMouseEnter = (e, opensDropdown = false) => {
    // Cancela qualquer timeout pendente para fechar o menu
    clearTimeout(closeTimeoutRef.current);

    // Calcula a posição e mostra o sublinhado
    const navRect = navRef.current.getBoundingClientRect();
    const itemRect = e.currentTarget.getBoundingClientRect();
    setUnderline({
      left: itemRect.left - navRect.left,
      width: itemRect.width,
      visible: true
    });

    // Abre o dropdown apenas se for o item correto
    setIsDropdownOpen(opensDropdown);
  };

  // Função chamada quando o rato sai da ÁREA TOTAL da navegação
  const handleMouseLeaveNav = () => {
    // Inicia um pequeno timeout para dar uma sensação mais suave
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
      setUnderline(u => ({ ...u, visible: false }));
    }, 150);
  };

  return (
    <HeaderContainer>
      <LogoContainer as={Link} to="/" style={{ textDecoration: 'none' }}>
        <img src={logo} alt="Logo Ada" />
        <span>CASI UFPA</span>
      </LogoContainer>

      {/* Os eventos agora estão no container <Nav> */}
      <Nav ref={navRef} onMouseLeave={handleMouseLeaveNav} onMouseEnter={() => clearTimeout(closeTimeoutRef.current)}>
        {/* NavItem CASI (com dropdown) */}
        <NavItem onMouseEnter={e => handleMouseEnter(e, true)}>
          <NavLink as={Link} to="/">
            CASI&nbsp;<Arrow $open={isDropdownOpen}>▾</Arrow>
          </NavLink>
          <DropdownMenu $open={isDropdownOpen}>
            <DropdownItem href="/#sobre">Sobre</DropdownItem>
            <DropdownItem href="/#gestao-atual" $hasDivider>Gestão Atual</DropdownItem>
            <DropdownItem href="/#localizacao" $hasDivider>Localização</DropdownItem>
          </DropdownMenu>
        </NavItem>

        {/* Outros itens (sem dropdown) */}
        <NavItem onMouseEnter={handleMouseEnter}>
          <NavLink as={Link} to="/noticias">Notícias</NavLink>
        </NavItem>

        <NavItem onMouseEnter={handleMouseEnter}>
          <NavLink as={Link} to="/projetos">Projetos</NavLink>
        </NavItem>

        <NavItem onMouseEnter={handleMouseEnter}>
          <NavLink as={Link} to="/publicacoes">Publicações</NavLink>
        </NavItem>

        {/* Botão Loja (com comportamento especial) */}
        <ShopButton as={Link} to="/loja" onMouseEnter={() => setUnderline(u => ({ ...u, visible: false }))}>
          LOJA
        </ShopButton>

        {/* Underline animada (continua igual) */}
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