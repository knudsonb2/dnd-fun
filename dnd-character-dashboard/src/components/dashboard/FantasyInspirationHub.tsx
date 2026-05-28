import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

type InspirationItem = {
  title: string;
  creator: string;
  source: 'CivitAI-style' | 'DeviantArt-style';
  type: 'image' | 'video';
  mood: 'epic' | 'mystic' | 'dark';
  mediaUrl: string;
  prompt: string;
};

const items: InspirationItem[] = [
  {
    title: 'Stormkeep Above the Clouds',
    creator: 'AetherForge Studio',
    source: 'CivitAI-style',
    type: 'image',
    mood: 'epic',
    mediaUrl:
      'https://images.unsplash.com/photo-1518709414768-a88981a4515d?auto=format&fit=crop&w=1400&q=80',
    prompt:
      'Cinematic fantasy fortress floating over storm clouds, dragon silhouettes, dramatic god rays, ultra-detailed matte painting, 8k concept art'
  },
  {
    title: 'Rune Library of Veyra',
    creator: 'MoonInk Atelier',
    source: 'DeviantArt-style',
    type: 'image',
    mood: 'mystic',
    mediaUrl:
      'https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?auto=format&fit=crop&w=1400&q=80',
    prompt:
      'Ancient arcane library, glowing runes, floating books, warm candlelight, wizard tower interior, fantasy illustration with intricate details'
  },
  {
    title: 'Ashen Vale Hunt',
    creator: 'Nightglass Works',
    source: 'CivitAI-style',
    type: 'video',
    mood: 'dark',
    mediaUrl: 'https://www.youtube.com/embed/9Q634rbsypE?si=KXJ5MOIxYQ6CZfYH',
    prompt:
      'Dark fantasy valley at dusk, spectral wolves, drifting embers, haunted trees, cinematic volumetric fog, stylized realism'
  },
  {
    title: 'Celestial Harbor at Dawn',
    creator: 'Skylore Guild',
    source: 'DeviantArt-style',
    type: 'video',
    mood: 'epic',
    mediaUrl: 'https://www.youtube.com/embed/cM8DcCoZ6J0?si=7BGFPQQ_SJpyl0Un',
    prompt:
      'Fantasy port city sunrise, skyships docking, magical beacons, ornate architecture, wide-angle environment concept, painterly finish'
  }
];

const Wrap = styled.section`
  display: grid;
  gap: 0.9rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: linear-gradient(140deg, color-mix(in oklch, var(--surface), black 2%), color-mix(in oklch, var(--surface-elevated), black 14%));
`;

const Header = styled.div`
  display: flex;
  gap: 0.65rem;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  margin: 0;
`;

const Sub = styled.p`
  margin: 0.3rem 0 0;
  color: var(--text-muted);
`;

const Toolbar = styled.div`
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
`;

const Filter = styled.button<{ $active?: boolean }>`
  min-height: 32px;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? 'color-mix(in oklch, var(--brand), white 15%)' : 'var(--border)')};
  background: ${({ $active }) =>
    $active
      ? 'linear-gradient(135deg, color-mix(in oklch, var(--brand), black 8%), color-mix(in oklch, var(--brand-2), black 8%))'
      : 'color-mix(in oklch, var(--surface-muted), black 8%)'};
  color: ${({ $active }) => ($active ? 'white' : 'var(--text-default)')};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  background: color-mix(in oklch, var(--surface), black 5%);
`;

const MediaFrame = styled.div`
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: color-mix(in oklch, var(--surface-muted), black 18%);

  img,
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
  }

  img {
    object-fit: cover;
    transition: transform 220ms ease;
  }

  ${Card}:hover & img {
    transform: scale(1.04);
  }
`;

const Body = styled.div`
  display: grid;
  gap: 0.45rem;
  padding: 0.75rem;
`;

const Meta = styled.p`
  margin: 0;
  color: var(--text-muted);
  font-size: 0.86rem;
`;

const CardTitle = styled.h3`
  margin: 0;
`;

const Prompt = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  align-items: center;
`;

const Badge = styled.span`
  font-size: 0.72rem;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: color-mix(in oklch, var(--surface-elevated), black 12%);
`;

const CopyButton = styled.button`
  min-height: 30px;
  padding: 0.25rem 0.6rem;
  font-size: 0.8rem;
`;

const FantasyInspirationHub: React.FC = () => {
  const [filter, setFilter] = useState<'all' | InspirationItem['type']>('all');
  const [copied, setCopied] = useState<string>('');

  const visibleItems = useMemo(() => {
    if (filter === 'all') {
      return items;
    }

    return items.filter((item) => item.type === filter);
  }, [filter]);

  const copyPrompt = async (title: string, prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(title);
      window.setTimeout(() => setCopied(''), 1600);
    } catch {
      setCopied('Clipboard unavailable');
      window.setTimeout(() => setCopied(''), 1400);
    }
  };

  return (
    <Wrap>
      <Header>
        <div>
          <Title>Fantasy Inspiration Hub</Title>
          <Sub>Interactive visual feed inspired by creator platforms, with reusable AI prompts for your next session.</Sub>
        </div>
        <Toolbar>
          <Filter type="button" $active={filter === 'all'} onClick={() => setFilter('all')}>
            All
          </Filter>
          <Filter type="button" $active={filter === 'image'} onClick={() => setFilter('image')}>
            Images
          </Filter>
          <Filter type="button" $active={filter === 'video'} onClick={() => setFilter('video')}>
            Videos
          </Filter>
        </Toolbar>
      </Header>

      <Grid>
        {visibleItems.map((item) => (
          <Card key={item.title}>
            <MediaFrame>
              {item.type === 'image' ? (
                <img src={item.mediaUrl} alt={item.title} loading="lazy" />
              ) : (
                <iframe
                  src={item.mediaUrl}
                  title={item.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              )}
            </MediaFrame>
            <Body>
              <Row>
                <Badge>{item.source}</Badge>
                <Badge>{item.mood}</Badge>
              </Row>
              <CardTitle>{item.title}</CardTitle>
              <Meta>by {item.creator}</Meta>
              <Prompt>{item.prompt}</Prompt>
              <Row>
                <Meta>{item.type === 'image' ? 'AI-ready artwork prompt' : 'Ambience video reference'}</Meta>
                <CopyButton type="button" onClick={() => copyPrompt(item.title, item.prompt)}>
                  {copied === item.title ? 'Copied' : 'Copy prompt'}
                </CopyButton>
              </Row>
            </Body>
          </Card>
        ))}
      </Grid>
    </Wrap>
  );
};

export default FantasyInspirationHub;
