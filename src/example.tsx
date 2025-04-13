import React, { useEffect, useRef, useState } from 'react';

import { cn } from '@/shared/ui/styles/utils';

interface OnboardingProps {
  onComplete?: () => void;
  slideInterval?: number; // Time in milliseconds between auto-slides
}

const TOTAL_SLIDES = 3;
const imageUrls = [
  '/images/onboarding/1/1@3x.png',
  '/images/onboarding/3/3@3x.png',
  '/images/onboarding/2/2@3x.png',
];

const SWIPE_THRESHOLD = 75;

export default function Onboarding({
  onComplete,
  slideInterval = 4000,
}: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragX, setDragX] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      if (prev >= TOTAL_SLIDES - 1) {
        if (onComplete) onComplete();
        return 0; // Loop back to first slide
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      if (prev === 0) {
        return TOTAL_SLIDES - 1; // Go to last slide
      }
      return prev - 1;
    });
  };

  // Auto-sliding effect
  useEffect(() => {
    if (slideInterval > 0) {
      autoPlayRef.current = window.setInterval(() => {
        nextSlide();
      }, slideInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        window.clearInterval(autoPlayRef.current);
      }
    };
  }, [slideInterval]);

  // Reset auto-slide timer when manually changing slides
  const resetAutoPlayTimer = () => {
    if (autoPlayRef.current) {
      window.clearInterval(autoPlayRef.current);
      autoPlayRef.current = window.setInterval(() => {
        nextSlide();
      }, slideInterval);
    }
  };

  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.style.transition = isDragging
        ? 'none'
        : 'all 0.5s ease-in-out';
      const offset = isDragging ? dragX : 0;
      slideRef.current.style.transform = `translateX(calc(-${String(
        currentSlide * 100
      )}% + ${offset}px))`;
    }
  }, [currentSlide, isDragging, dragX]);

  // 터치 슬라이드 이벤트 처리를 위한 상태와 핸들러
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    // Pause auto-sliding during touch interaction
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > SWIPE_THRESHOLD) {
      // 왼쪽으로 스와이프
      nextSlide();
    }

    if (touchStart - touchEnd < -SWIPE_THRESHOLD) {
      // 오른쪽으로 스와이프
      prevSlide();
    }
    // Resume auto-sliding after touch interaction
    resetAutoPlayTimer();
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    setDragX(diff);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const endX = e.clientX;
    const diff = endX - startX;

    setIsDragging(false);
    setDragX(0);

    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    resetAutoPlayTimer();
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (isDragging) {
      const endX = e.clientX;
      const diff = endX - startX;

      setIsDragging(false);
      setDragX(0);

      if (Math.abs(diff) > SWIPE_THRESHOLD) {
        if (diff > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
      }
      resetAutoPlayTimer();
    }
  };

  return (
    <div className="w-full h-full flex flex-col py-8 px-5">
      <div
        className="w-full flex-1 overflow-hidden relative select-none cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={slideRef} className="w-full h-full flex">
          {imageUrls.map((url, index) => (
            <div
              key={index}
              className="min-w-full w-full h-full flex-shrink-0 flex items-center justify-center"
            >
              <img
                src={url}
                alt={`온보딩 이미지 ${String(index + 1)}`}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 인디케이터 */}
      <div className="flex justify-center items-center py-6">
        {Array.from({ length: TOTAL_SLIDES }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-2 rounded-full mx-1',
              currentSlide === index ? 'bg-[#89F336]' : 'bg-[#CCCCCC]',
              currentSlide === index ? 'w-4' : 'w-2'
            )}
            onClick={() => {
              setCurrentSlide(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}
