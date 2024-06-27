import { CSSProperties } from 'react';

export interface EditableTextProps {
  className?: string;
  style?: CSSProperties;
  editable?: boolean;
  error?: string;
  value?: string;
  onChange?: (val: string) => void;
}
