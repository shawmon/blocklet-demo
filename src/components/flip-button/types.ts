import { CSSProperties, ReactNode } from 'react';

export interface FlipButtonProps {
  className?: string;
  style?: CSSProperties;
  defaultContent: ReactNode;
  flipedContent: ReactNode;
  onDefaultClick?: () => void;
  onFlipedClick?: () => void;
  fliped?: boolean;
}
