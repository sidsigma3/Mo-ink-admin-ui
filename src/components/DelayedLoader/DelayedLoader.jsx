// components/DelayedLoader.jsx
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

const DelayedLoader = ({ loading, children, delay = 2000 }) => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => setShowLoader(true), delay);
    } else {
      setShowLoader(false);
    }

    return () => clearTimeout(timer);
  }, [loading, delay]);

  if (loading && showLoader) {
    return (
      <div className="w-full flex justify-center items-center min-h-[200px]">
        <div className="w-48 h-48">
          <Lottie
            animationData={require('https://lottie.host/embed/71c06a77-fd29-4bb9-bd19-d127fc0cb4a3/EpUw4DtmBI.json')}
            loop
            autoplay
          />
        </div>
      </div>
    );
  }

  return children;
};

export default DelayedLoader;
