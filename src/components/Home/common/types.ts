import { SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';
import { SvgIconComponent } from '@mui/icons-material';

export interface HeroContent {
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface MissionContent {
  title: string;
  description: string;
  points: string[];
}

export interface ActionCard {
  title: string;
  description: string;
  link: string;
  icon: string;
}

export interface Resource {
  title: string;
  description: string;
  link: string;
}

export interface FinalCta {
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

// Props interfaces for components
export interface SectionProps {
  children: ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

export interface StatCardProps {
  stat: Stat;
  delay?: number;
}

export interface ActionCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  icon: SvgIconComponent;
  delay?: number;
}

export interface ResourceCardProps {
  title: string;
  description: string;
  link: string;
  icon: SvgIconComponent;
  delay?: number;
} 