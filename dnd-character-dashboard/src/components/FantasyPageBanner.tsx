import React from 'react';
import styled from 'styled-components';

type FantasyPageBannerProps = {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
};

const Wrap = styled.section`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: color-mix(in oklch, var(--surface), black 4%);
  box-shadow: var(--shadow-sm);
  margin-bottom: 1rem;
`;

const Img = styled.img`
  width: 100%;
  max-height: 230px;
  object-fit: cover;
  opacity: 0.78;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, color-mix(in oklch, var(--surface), transparent 98%) 20%, color-mix(in oklch, var(--surface), black 14%) 100%);
`;

const Content = styled.div`
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 0.9rem;
`;

const Title = styled.h2`
  margin: 0 0 0.25rem;
`;

const Subtitle = styled.p`
  margin: 0;
  color: var(--text-default);
`;

const FantasyPageBanner: React.FC<FantasyPageBannerProps> = ({
  title,
  subtitle,
  imageSrc,
  imageAlt
}) => (
  <Wrap>
    <Img src={imageSrc} alt={imageAlt} loading="lazy" />
    <Overlay />
    <Content>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </Content>
  </Wrap>
);

export default FantasyPageBanner;
