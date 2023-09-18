import Style from './index.less';
import { Resizable } from 're-resizable';

interface SidebarProps {
  className?: string;
  setCol1Width: (h: number) => void
}

export default (props: SidebarProps) => {
  const { className, setCol1Width } = props;

  const NAV_LIST = [
    {
      key: 'COMPONENT',
      label: '组件',
    },
    {
      key: 'NODE',
      label: '节点',
    },
    {
      key: 'OPTION',
      label: '设置',
    },
  ];

  const changeNavPopup = (key: string) => {
    console.log(key);
  };

  return (
    <Resizable
      className={Style['nav-groups'] + ' ' + className }
      minWidth={50}
      maxWidth={200}
      enable={{
        right: true,
      }}
      onResize={(e, dir, n) => setCol1Width(n.clientWidth)}
    >
      {
        NAV_LIST.map(i => (
          <div
            key={i.key}
            className={Style['nav-item']}
            onClick={() => changeNavPopup(i.key)}
          >
            <span>{ i.label }</span>
          </div>
        ))
      }
    </Resizable>
  );
};
