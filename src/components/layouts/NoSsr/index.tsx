import React from 'react';

interface NoSsrProps {
  disable?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const NoSsr: React.FC<NoSsrProps> = ({ disable, fallback, children }: NoSsrProps) => {
  const [canRender, setCanRender] = React.useState(disable);

  React.useEffect(() => {
    if (canRender !== true) {
      setCanRender(true);
    }
  }, [canRender]);

  return <>{canRender ? children : fallback}</>;
};

NoSsr.defaultProps = {
  disable: false,
  fallback: null,
};

export default NoSsr;
