import { useCallback, useState, useRef, useEffect } from 'react';
import { twMerge as cn } from 'tailwind-merge';
import { EditableTextProps } from './types';

export function EditableText({ className, style, value, onChange, editable = false, error }: EditableTextProps) {
  const [focus, setFocus] = useState(false);

  const inputRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    const propValue = value || '';

    if (inputRef.current.textContent !== propValue) {
      inputRef.current.textContent = propValue;
    }
  });

  const handleClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className={cn(
        'inline-block rounded relative',
        editable && 'bg-neutral-100',
        focus && 'shadow-[0_0_0_4px_rgba(13,110,253,.25)]',
        error && 'shadow-[0_0_0_4px_rgba(255,77,79,.25)]',
        className,
      )}
      style={style}
      onClick={handleClick}>
      <div
        ref={inputRef}
        className="outline-none px-2"
        contentEditable={editable}
        onInput={(e) => onChange?.(e.currentTarget?.textContent ?? '')}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      {editable && !focus && (
        <svg
          className="w-5 h-5 p-1 box-border text-neutral-500 absolute right-0 top-0 fill-current bg-neutral-100"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="200">
          <path d="M280.576 877.714286l52.004571-52.004572-134.290285-134.290285L146.285714 743.424V804.571429h73.142857v73.142857h61.147429z m298.861714-530.285715a12.032 12.032 0 0 0-12.580571-12.580571 13.458286 13.458286 0 0 0-9.728 3.986286l-309.723429 309.723428a13.385143 13.385143 0 0 0-3.986285 9.728c0 7.424 5.156571 12.580571 12.580571 12.580572a13.458286 13.458286 0 0 0 9.728-3.986286l309.723429-309.723429a13.385143 13.385143 0 0 0 3.986285-9.728zM548.571429 237.714286l237.714285 237.714285-475.428571 475.428572H73.142857v-237.714286zM938.861714 292.571429c0 19.419429-8.009143 38.290286-21.138285 51.419428L822.857143 438.857143 585.142857 201.142857l94.866286-94.281143c13.129143-13.714286 32-21.723429 51.419428-21.723428s38.290286 8.009143 52.004572 21.723428l134.290286 133.705143c13.129143 13.714286 21.138286 32.585143 21.138285 52.004572z" />
        </svg>
      )}
    </div>
  );
}
