import React, { useEffect } from 'react';
import styled from 'styled-components';
import { makeLetterAvatar } from './drawAvatar';

interface LetterAvatarProps {
  firstName?: string;
  lastName?: string;
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
  onClick?: (e: React.MouseEvent) => void;
}

const LetterAvatarWrapper = styled.span``;

const LetterAvatar: React.FC<LetterAvatarProps> = (props: LetterAvatarProps) => {
  const { firstName, lastName, width, height, onCanvasReady, onClick } = props;
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handler = makeLetterAvatar(`${firstName} ${lastName}`, 24, canvasRef.current);

    if (onCanvasReady) {
      onCanvasReady(handler);
    }
  }, [firstName, lastName, onCanvasReady, canvasRef]);

  return (
    <LetterAvatarWrapper onClick={onClick}>
      <canvas style={{ width: width, height: height, borderRadius: width / 2 }} ref={canvasRef} width={width} height={height} />
    </LetterAvatarWrapper>
  );
};

LetterAvatar.defaultProps = {
  width: 24,
  height: 24,
};

export default LetterAvatar;
