import { useState, useEffect } from 'react';

export function useSectionObserver(sectionIds: string[], options: IntersectionObserverInit = {}) {
  const [currentSection, setCurrentSection] = useState<string>('hero');

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -35% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
      ...options,
    };

    const sectionElements: { id: string; element: HTMLElement }[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionElements.push({ id, element: el });
    });

    if (sectionElements.length === 0) return;

    const visibleRatios: Record<string, number> = {};

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.id) {
          visibleRatios[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        }
      });

      let maxRatio = 0;
      let activeId = '';
      Object.entries(visibleRatios).forEach(([id, ratio]) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          activeId = id;
        }
      });

      if (activeId) {
        setCurrentSection(activeId);
      }
    }, observerOptions);

    sectionElements.forEach(({ element }) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [sectionIds.join(','), options.rootMargin]);

  return currentSection;
}

export default useSectionObserver;
