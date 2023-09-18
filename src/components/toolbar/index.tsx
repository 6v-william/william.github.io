import { Resizable } from 're-resizable';
import Style from './index.less'

interface ToolbarProps {
  className?: string
  setCol2Width: (w: number) => void
}

export default (props: ToolbarProps) => {
  const { className, setCol2Width } = props;

  return (
    <Resizable
      className={ className }
      minWidth={100}
      maxWidth={400}
      enable={{
        right: true,
      }}
      onResize={(e, dir, n) => setCol2Width(n.clientWidth)}
    >
      工具栏
    </Resizable>
  );
};
