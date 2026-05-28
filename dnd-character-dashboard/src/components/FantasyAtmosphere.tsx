import React from 'react';
import styled, { keyframes } from 'styled-components';

const drift = keyframes`
  0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.5; }
  50% { transform: translate3d(10px, -12px, 0) scale(1.05); opacity: 0.75; }
  100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.5; }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.15; transform: translateY(0); }
  50% { opacity: 0.55; transform: translateY(-4px); }
`;

const Layer = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const Glow = styled.div`
  position: absolute;
  width: 38vw;
  max-width: 420px;
  aspect-ratio: 1;
  filter: blur(44px);
  border-radius: 999px;
  opacity: 0.48;
  animation: ${drift} 8s ease-in-out infinite;

  &.a {
    top: 8%;
    left: -8%;
    background: color-mix(in oklch, var(--brand), white 65%);
  }

  &.b {
    right: -10%;
    bottom: 12%;
    animation-delay: 1.8s;
    background: color-mix(in oklch, var(--brand-2), white 68%);
  }
`;

const Rune = styled.span`
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: color-mix(in oklch, var(--accent), white 35%);
  animation: ${twinkle} 2.4s ease-in-out infinite;

  &:nth-child(3) { top: 18%; left: 24%; animation-delay: 0.4s; }
  &:nth-child(4) { top: 22%; left: 72%; animation-delay: 1.3s; }
  &:nth-child(5) { top: 54%; left: 12%; animation-delay: 0.8s; }
  &:nth-child(6) { top: 70%; left: 83%; animation-delay: 1.7s; }
  &:nth-child(7) { top: 80%; left: 44%; animation-delay: 0.2s; }
`;

const FantasyAtmosphere: React.FC = () => (
  <Layer aria-hidden="true">
    <Glow className="a" />
    <Glow className="b" />
    <Rune />
    <Rune />
    <Rune />
    <Rune />
    <Rune />
  </Layer>
);

export default FantasyAtmosphere;
