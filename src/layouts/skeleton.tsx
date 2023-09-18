/**
 * 骨架区域，用于控制editor各个区域的显示
 */
import Topbar from '@/components/topbar';
import Sidebar from '@/components/sidebar';
import Toolbar from '@/components/toolbar';
import ViewArea from '@/components/viewArea';
import CanvasArea from '@/components/canvas-area';
import { useState } from 'react';
import Style from './skeleton.less';
import useSchemaEffect from './useSchemaEffect';

export default () => {

  const [row3Height, setRow3Height] = useState<number>(400); // 第三行高度
  const [col1Width, setCol1Width] = useState<number>(50); // 第一列宽度
  const [col2Width, setCol2Width] = useState<number>(200); // 第二列宽度

  /* 初始注册schema，异步获取 */
  useSchemaEffect();

  return (
    <div
      className={Style['editor-skeleton']}
      style={{
        gridTemplateRows: `50px 1fr ${ row3Height }px`,
        gridTemplateColumns: `${ col1Width }px ${ col2Width }px 1fr`,
      }}
    >

      {/* 顶部栏 */}
      <Topbar className={Style['editor-topbar']} />

      {/* 侧边栏 */}
      <Sidebar className={Style['editor-sidebar']} setCol1Width={setCol1Width} />

      {/* 工具栏 */}
      <Toolbar className={Style['editor-tool']} setCol2Width={setCol2Width} />

      {/* 预览区 */}
      <ViewArea className={Style['editor-view']} />

      {/* flow */}
      <CanvasArea className={Style['editor-canvas']} setRow3Height={setRow3Height} />

    </div>
  );
};
