import { useCallback } from 'react';
import { trackEvent, getStoredAnalytics, clearStoredAnalytics, AnalyticsEvent } from '../lib/analytics';

export function useAnalytics() {
  const track = useCallback((eventName: string, properties?: Record<string, any>) => {
    trackEvent(eventName, properties);
  }, []);

  const trackCTA = useCallback((ctaName: string, location: string, extraProps?: Record<string, any>) => {
    trackEvent('cta_click', {
      cta_name: ctaName,
      location,
      ...extraProps,
    });
  }, []);

  return {
    trackEvent: track,
    trackCTA,
    getStoredAnalytics,
    clearStoredAnalytics,
  };
}

export type { AnalyticsEvent };
