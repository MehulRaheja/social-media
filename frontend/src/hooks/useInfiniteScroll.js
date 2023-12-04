import { useCallback, useEffect } from 'react';

// bodyRef is the body element which contains the scroll
const useInfiniteScroll = (bodyRef, bottomLineRef, callback) => {
  const handleScroll = useCallback(() => {
    const containerHeight = bodyRef?.current?.getBoundingClientRect().height;
    const { top: bottomLineTop } = bottomLineRef?.current?.getBoundingClientRect();
    if (bottomLineTop <= containerHeight) {
      // this condition will check that scrolling reaches to the bottom of the element which contains bottomLineRef
      callback();
    }
  }, [bodyRef, bottomLineRef, callback]);

  useEffect(() => {
    const bodyRefCurrent = bodyRef?.current;
    // third parameter is optional property and true means we want it to behave as it should behave.
    bodyRefCurrent?.addEventListener('scroll', handleScroll, true);
    return () => bodyRefCurrent.removeEventListener('scroll', handleScroll, true);
  }, [bodyRef, handleScroll]);
};
export default useInfiniteScroll;

// <div ref={bodyRef}>
//   -----
//   -----
//   -----
//   -----
//   <div ref={bottomLineRef}></div>
// </div>
// when scrolling reaches to the bottomLineRef element, then we call the infiniteScroll hook
