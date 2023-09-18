import Style from './index.less';

interface TopbarProps {
  className?: string
}

export default (props: TopbarProps) => {
  const { className } = props;

  return (
    <div className={className}>
      顶部栏
    </div>
  );
};
