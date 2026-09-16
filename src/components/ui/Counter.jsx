import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * Reusable Animated Counter Component
 * Counts smoothly from 0 to target number when scrolled into view.
 * 
 * @param {Object} props
 * @param {number} props.target - Final target count value
 * @param {number} [props.duration=2] - Animation duration in seconds
 * @param {string} [props.prefix=''] - Text/symbol prepended (e.g., '₹')
 * @param {string} [props.suffix=''] - Text/symbol appended (e.g., '+')
 * @param {string} [props.className=''] - Custom styling
 */
const Counter = ({
  target,
  duration = 2,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime = null;
    const startValue = 0;
    const endValue = target;
    let animationFrameId;

    const easeOutQuad = (t) => t * (2 - t);

    const updateCounter = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const easedProgress = easeOutQuad(progress);
      
      const currentCount = Math.floor(startValue + (endValue - startValue) * easedProgress);
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        setCount(endValue);
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, target, duration]);

  // Format with locale commas if over 999
  const formattedCount = count >= 1000 ? count.toLocaleString('en-IN') : count;

  return (
    <span ref={ref} className={`font-mono font-extrabold tracking-tight ${className}`}>
      {prefix}{formattedCount}{suffix}
    </span>
  );
};

export default Counter;
