import { useCallback } from 'react';
import { twMerge as cn } from 'tailwind-merge';
import { FlipButtonProps } from './types';

export function FlipButton({
  className,
  style,
  fliped = false,
  defaultContent,
  flipedContent,
  onDefaultClick,
  onFlipedClick,
}: FlipButtonProps) {
  const handleClick = useCallback(() => {
    (fliped ? onFlipedClick : onDefaultClick)?.();
  }, [fliped, onFlipedClick, onDefaultClick]);

  return (
    <button
      className={cn('group relative inline-block font-semibold px-3.5 py-2.5 box-border', className)}
      style={style}
      onClick={handleClick}>
      <div
        className={cn(
          'absolute top-0 left-0 right-0 bottom-0 text-white bg-blue-500 flex items-center justify-center origin-[50%_50%_-2.07692em] transition-transform [transform:rotateX(0)]',
          fliped && '[transform:rotateX(90deg)]',
        )}>
        {defaultContent}
      </div>
      &nbsp;
      <div
        className={cn(
          'absolute top-0 left-0 right-0 bottom-0 text-white bg-orange-400 flex items-center justify-center origin-[50%_50%_-2.07692em] transition-transform [transform:rotateX(-90deg)]',
          fliped && '[transform:rotateX(0)]',
        )}>
        {flipedContent}
      </div>
    </button>
  );
}
