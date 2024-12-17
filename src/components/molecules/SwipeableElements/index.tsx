import * as React from 'react';
import { space, layout, SpaceProps, LayoutProps } from 'styled-system';
import Flex from '@components/layouts/Flex';
import styled from 'styled-components';

const TRANSITION_DURATION = 500;

type SwipeState = {
  isSwiping: boolean;
  containerWidth: number;
  numOfElements: number;
  position: number;
  startX: number;
  offsetX: number;
  transitionDuration: number;
};

const InitialSwipeState: SwipeState = {
  position: 0,
  containerWidth: 0,
  numOfElements: 0,
  isSwiping: false,
  startX: 0,
  offsetX: 0,
  transitionDuration: 0,
};

const SWIPE_START = 'SWIPE_START';

const createSwipeStartAction = (startX: number, containerWidth: number, numOfElements: number) => {
  return { type: SWIPE_START, startX, containerWidth, numOfElements } as const;
};

const SWIPE_MOVE = 'SWIPE_MOVE';

const createSwipeMoveAction = (currentX: number) => {
  return { type: SWIPE_MOVE, currentX } as const;
};

const SWIPE_END = 'SWIPE_END';

const createSwipeEndAction = () => {
  return { type: SWIPE_END } as const;
};

type SwipeAction =
  | ReturnType<typeof createSwipeStartAction>
  | ReturnType<typeof createSwipeMoveAction>
  | ReturnType<typeof createSwipeEndAction>;

const reducer = (prevState: SwipeState, action: SwipeAction): SwipeState => {
  switch (action.type) {
    case SWIPE_START:
      return {
        ...prevState,
        startX: action.startX,
        containerWidth: action.containerWidth,
        numOfElements: action.numOfElements,
        isSwiping: true,
        transitionDuration: 0,
      };
    case SWIPE_MOVE: {
      const offsetX = action.currentX - prevState.startX - prevState.position * prevState.containerWidth;

      return { ...prevState, offsetX };
    }
    case SWIPE_END: {
      const diff = prevState.offsetX + prevState.position * prevState.containerWidth;
      let position = prevState.position;

      if (Math.abs(diff) > prevState.containerWidth / 2) {
        if (diff < 0) {
          position = Math.min(prevState.numOfElements - 1, position + 1);
        } else {
          position = Math.max(0, position - 1);
        }
      }

      const offsetX = -1 * position * prevState.containerWidth;

      return { ...prevState, isSwiping: false, position, offsetX, transitionDuration: TRANSITION_DURATION };
    }
    default:
      return prevState;
  }
};

const ChildContainer = styled(Flex)<{ offset: number; transitionDuration: number }>`
  position: relative;
  height: 100%;
  width: 100%;
  flex: 0 0 auto;
  left: ${({ offset }) => `${offset}px`};
  transitionproperty: transform;
  transition-duration: ${({ transitionDuration }) => `${transitionDuration}ms`};
  img {
    pointer-events: none;
    user-select: none;
  }
`;

const Container = styled(Flex)<SpaceProps & LayoutProps>`
  ${space};
  ${layout};
  position: relative;
  overflow: hidden;
`;

interface SwipeableElementsProps extends SpaceProps, LayoutProps {
  children: React.ReactNode[];
  onChangePosition?: (newPosition: number) => void;
}

const SwipeableElements: React.FC<SwipeableElementsProps> = (props: SwipeableElementsProps) => {
  const { children, onChangePosition, ...rest } = props;

  const containerRef = React.useRef(null);
  const [swipeState, dispatch] = React.useReducer(reducer, InitialSwipeState);
  const { isSwiping, offsetX, transitionDuration, position } = swipeState;

  React.useEffect(() => {
    onChangePosition && onChangePosition(position);
  }, [position, onChangePosition]);

  const onTouchStart = React.useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const startX = e.touches[0].clientX;

      dispatch(createSwipeStartAction(startX, containerRef.current.clientWidth, children.length));
    },
    [dispatch, children],
  );
  const onTouchEnd = React.useCallback(() => {
    dispatch(createSwipeEndAction());
  }, [dispatch]);
  const onTouchMove = React.useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const currentX = e.touches[0].clientX;

      dispatch(createSwipeMoveAction(currentX));
    },
    [dispatch],
  );
  const onMouseDown = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const startX = e.clientX - e.currentTarget.getBoundingClientRect().x;

      dispatch(createSwipeStartAction(startX, containerRef.current.clientWidth, children.length));
    },
    [dispatch, children],
  );
  const onMouseUp = React.useCallback(() => {
    dispatch(createSwipeEndAction());
  }, [dispatch]);
  const onMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isSwiping) {
        const currentX = e.clientX - e.currentTarget.getBoundingClientRect().x;

        dispatch(createSwipeMoveAction(currentX));
      }
    },
    [isSwiping, dispatch],
  );

  return (
    <Container
      ref={containerRef}
      {...rest}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      onTouchMove={onTouchMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseMove={onMouseMove}
    >
      {children.map((child, index) => (
        <ChildContainer key={index} alignItems="center" justifyContent="center" offset={offsetX} transitionDuration={transitionDuration}>
          {child}
        </ChildContainer>
      ))}
    </Container>
  );
};

export default SwipeableElements;
