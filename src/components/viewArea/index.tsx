// import { PreviewPannel } from '@rp/iwlc-builder';
import Style from './index.less';

interface ViewAreaProps {
  className?: string
}

export default (props: ViewAreaProps) => {
  const { className } = props;

  return (
    <div className={ className }>
      {/* <PreviewPannel /> */}
    </div>
  );
};
