import { useEffect, useState, useCallback } from 'react';

export default function TouchControl({ disabled, value, onChange }) {
  const centerX = 187.5;
  const centerY = 333.5;
  const [lastValue, setLastValue] = useState(0);

  const getRotation = useCallback((e) => {
    return -Math.atan2(e.touches[0].pageY - centerY, e.touches[0].pageX - centerX) * 180 * 4 / Math.PI;
  }, [centerX, centerY]);

  const onTouchStart = useCallback((e) => {
    const rotationValue = getRotation(e);
    setLastValue((prevLastValue) => prevLastValue - rotationValue);
  }, [getRotation]);

  const onTouchEnd = useCallback(() => {
    setLastValue(value);
  }, [value]);

  const onTouchMove = useCallback((e) => {
    const rotationValue = getRotation(e);
    onChange(rotationValue + lastValue);
  }, [getRotation, lastValue, onChange]);

  useEffect(() => {
    if (!disabled) {
      document.addEventListener('touchstart', onTouchStart, { passive: true });
      document.addEventListener('touchend', onTouchEnd, { passive: true });
      document.addEventListener('touchmove', onTouchMove, { passive: true });
    } else {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchmove', onTouchMove);
    }

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchmove', onTouchMove);
    };
  }, [disabled, onTouchStart, onTouchEnd, onTouchMove]);

  return null;
};
