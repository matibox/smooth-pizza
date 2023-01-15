import { type FC } from 'react';
import { PuffLoader } from 'react-spinners';

type LoadingProps = {
  isLoading: boolean;
  fullScreen?: boolean;
};

const Loading: FC<LoadingProps> = ({ isLoading, fullScreen = false }) => {
  return (
    <>
      {isLoading && (
        <div
          className={`${
            fullScreen
              ? 'absolute top-0 left-0 z-50 h-screen w-screen bg-stone-900/60'
              : ''
          } flex  items-center justify-center `}
        >
          <PuffLoader color='#f59e0b' size={75} />
        </div>
      )}
    </>
  );
};

export default Loading;
