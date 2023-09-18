import { Resizable } from 're-resizable';
import Style from './index.less';

interface CanvasAreaType {
  className?: string
  setRow3Height: (h: number) => void
}

export default (props: CanvasAreaType) => {
  const { className, setRow3Height } = props;

  return (
    <Resizable
      className={ className }
      minHeight={300}
      maxHeight={600}
      enable={{
        top: true,
      }}
      onResize={(e, dir, n) => setRow3Height(n.clientHeight)}
    >
      顶部栏
    </Resizable>
  );
};
