import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { animated, useSpring, type AnimatedProps } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

const MAX_WIDTH = 80;

const AnimatedDiv = animated.div as React.FC<
  AnimatedProps<React.HTMLAttributes<HTMLDivElement>> & {
    children?: React.ReactNode;
  }
>;

export function SwipeItem({
  id,
  text,
  openItemId,
  onOpen,
  onDelete,
}: {
  id: string;
  text: string;
  openItemId: string | null;
  onOpen: (id: string | null) => void;
  onDelete: () => void;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState(0);
  const isOpen = openItemId === id;

  const [{ deleteWidth }, api] = useSpring(() => ({
    deleteWidth: 0,
    config: { tension: 300, friction: 30 },
  }));

  useLayoutEffect(() => {
    if (itemRef.current) {
      setItemWidth(itemRef.current.offsetWidth);
    }
  }, []);

  // ✅ 외부에서 openItemId 바뀌면 열고/닫기 적용
  useEffect(() => {
    if (!isOpen) {
      api.start({ deleteWidth: 0 });
    }
  }, [isOpen]);

  const bind = useDrag(
    ({ movement: [mx], last }) => {
      if (!itemWidth) return;

      if (mx > 0) {
        const newWidth = Math.max(0, MAX_WIDTH - mx);

        if (last) {
          onOpen(null);
          api.start({ deleteWidth: 0 });
        } else {
          api.start({ deleteWidth: newWidth, immediate: false });
        }

        return;
      }

      if (last) {
        const current = deleteWidth.get();
        const shouldOpen = current > MAX_WIDTH / 2;
        onOpen(shouldOpen ? id : null);
        api.start({ deleteWidth: shouldOpen ? MAX_WIDTH : 0 });
        return;
      }

      const dragged = Math.max(0, -mx);
      api.start({ deleteWidth: dragged, immediate: true });
    },
    { axis: 'x', bounds: { left: -itemWidth, right: 0 }, rubberband: true }
  );

  return (
    <div
      {...bind()}
      ref={itemRef}
      style={{
        display: 'flex',
        overflow: 'hidden',
        borderBottom: '1px solid #ccc',
        height: 60,
        background: '#fff',
        touchAction: 'pan-y',
        userSelect: 'none',
      }}
    >
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        {text}
      </div>

      <AnimatedDiv
        style={{
          position: 'relative',
          opacity: deleteWidth.to((w) => (w < 2 ? 0 : 1)),
          width: deleteWidth.to((w) => (w < 2 ? 0 : w)),
          backgroundColor: '#e53935',
          overflow: 'hidden',
        }}
      >
        <button
          onClick={onDelete}
          style={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            width: 64,
            height: 36,
            background: 'white',
            color: '#e53935',
            border: 'none',
            borderRadius: 8,
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: 1,
          }}
        >
          삭제
        </button>
      </AnimatedDiv>
    </div>
  );
}
