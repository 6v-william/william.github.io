import './index.less';
export default (props: any) => {
  return (
    <div className="editor-navigation">
      <div className="navigation-main">
        <div className="navigation-item">
          <span className="item-icon">组件</span>
        </div>
        <div className="navigation-item">
          <span className="item-icon">节点</span>
        </div>
        <div className="navigation-item">
          <span className="item-icon">配置</span>
        </div>
      </div>
      <div className="editor-navigation-bottom"></div>
    </div>
  );
};
