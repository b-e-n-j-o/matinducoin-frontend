import React, { useEffect, useState } from 'react';
import LoadingIndicator from './LoadingIndicator';
import { useClickCounter, ClickCounterProvider } from './ClickCounterContext';

const ParentComponent = () => {
  const { clickCount, incrementClickCount } = useClickCounter();
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (clickCount > 0 && clickCount % 3 === 0) {
      setShowLoading(true);
    }
  }, [clickCount]);

  const handleClick = () => {
    incrementClickCount();
  };

  const handleComplete = () => {
    setShowLoading(false);
  };

  return (
    <div onClick={handleClick}>
      {showLoading && <LoadingIndicator onComplete={handleComplete} />}
      <div>Your main content here. Clicks: {clickCount}</div>
    </div>
  );
};

const App = () => (
  <ClickCounterProvider>
    <ParentComponent />
  </ClickCounterProvider>
);

export default App;
