import React from 'react';
import ImageBackground from './index';

export default { title: 'Molecules|ImageBackground' };

export const Standard = () => {
  return (
    <div style={{ width: '200px', height: '200px' }}>
      <ImageBackground imageSrc="url(/static/images/top_bg.jpg)" imageSize="cover" imageRepeat="no-repeat" background="rgba(29,52,97,0.69)">
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>hoge</div>
      </ImageBackground>
    </div>
  );
};
