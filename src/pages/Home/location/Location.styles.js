import styled from 'styled-components'
import { MapContainer } from 'react-leaflet'
import mapMask from '../../../assets/images/minecraftmap.png'

export const Wrapper = styled.div`
  position: relative;
  width: 60vw;
  max-width: 400px;
  aspect-ratio: 380 / 628;
  margin: 2rem auto;
  overflow: hidden;
  background-color: #FFFFFFFF; /* cor da borda para “selar” vazamentos */
`

export const StyledMap = styled(MapContainer)`
  width: 100%;
  height: 100%;
  z-index: 1;

  /* aplica a máscara ao próprio MapContainer */
  mask-image: url(${mapMask});
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-image: url(${mapMask});
  -webkit-mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;

  /* garante transparência do fundo interno do Leaflet */
  .leaflet-container {
    background: transparent;
  }
`

export const BorderOverlay = styled.img`
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 2;
  pointer-events: none;
`
export const LocationSectionContainer = styled.section`
  width: 100%;
  padding: -2rem 1rem;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LocationContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem; /* Diminuí um pouco o espaço para o mapa caber melhor */
  width: 100%;
  max-width: 1200px;
`;

export const TextColumn = styled.div`
  flex: 1; /* Ajustado para dar um pouco mais de espaço ao texto */
  max-width: 50%;

  h2 {
    font-size: 3rem;
    font-weight: 500;
    color: #343a40;
    margin-bottom: 1.5rem;
  }

  p {
    font-size: 1.1rem;
    color: #495057;
    line-height: 1.7;
    text-align: justify;
  }
`;

// Renomeado de ImageColumn para MapColumn para clareza
export const MapColumn = styled.div`
  flex: 1;
  max-width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  /* O componente do mapa será inserido aqui */
`;