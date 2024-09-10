import { CSSProperties, forwardRef, useImperativeHandle, useRef } from 'react';
import './index.less';

export interface IconProps {
  name: string;
  fontSize?: number;
  style?: CSSProperties;
  color?: string;
  className?: string;
  title?: string

  onClick?: (e: any) => void;
}

export default forwardRef<Element, IconProps>(function Icon(props, ref) {
  const { name, fontSize = 12, style, color, className, title, onClick } = props;

  const iconRef = useRef<any>(null);

  /* forward只抛出svgRef，因为其他的没啥用 */
  useImperativeHandle(ref, () => iconRef.current, [iconRef.current]);

  return (
    <svg
      className={`iconfont ${ className }`}
      style={{ ...style, width: fontSize, height: fontSize, fill: color }}
      aria-hidden
      ref={iconRef}
      onClick={onClick}
    >
      { title && <title>{ title }</title> }
      <use xlinkHref={'#' + name} />
    </svg>
  );
});
