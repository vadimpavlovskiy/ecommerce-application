export interface HeroSectionProps {
  imageSrc: string;
  heading: string;
  desc: string;
  stats: Stat[];
}

interface Stat {
  value: string;
  label: string;
}
