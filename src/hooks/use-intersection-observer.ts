import { FilterParams, SetQueryParamsType } from '@/@types/common';
import { useCallback, useRef, useEffect } from 'react';

const useIntersectionObserver = (queryParams: FilterParams, setQueryParams: SetQueryParamsType) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastNode = useRef<Element | null>(null);

  const lastEntryRef = useCallback(
    (node: Element | null) => {
      if (queryParams.loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && queryParams.hasMore) {
          setQueryParams((prev) => ({ ...prev, page: prev.page + 1 }));
        }
      });

      if (node) {
        observer.current.observe(node);
        lastNode.current = node;
      }
    },
    [queryParams.loading, queryParams.hasMore, setQueryParams]
  );

  // Check if last node is in view and trigger page update
  useEffect(() => {
    const handleScroll = (event: Event) => {
      event.preventDefault(); // Prevent the default scroll behavior
      if (lastNode.current && queryParams.hasMore && !queryParams.loading) {
        const lastNodeBottom = lastNode.current.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;

        if (lastNodeBottom <= windowHeight) {
          setQueryParams((prev) => ({ ...prev, page: prev.page + 1 }));
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: false });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [queryParams.loading, queryParams.hasMore, setQueryParams]);

  return { lastEntryRef };
};

export default useIntersectionObserver;
