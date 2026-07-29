/**
 * Lightweight & Performant Analytics Library for Manea Graphics
 * Supports Plausible, Google Analytics (gtag), local event history storage, and custom event dispatches.
 */

export interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, any>;
  timestamp: string;
  path: string;
}

const STORAGE_KEY = 'manea_analytics_events';
const MAX_LOCAL_EVENTS = 100;

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  const timestamp = new Date().toISOString();
  const path = typeof window !== 'undefined' ? window.location.pathname + window.location.hash : '';

  const eventData: AnalyticsEvent = {
    eventName,
    properties,
    timestamp,
    path,
  };

  // 1. Console log in development
  if (import.meta.env.DEV) {
    console.log('[Analytics Event]', eventName, properties);
  }

  // 2. Integration with Plausible if present
  if (typeof window !== 'undefined' && (window as any).plausible) {
    try {
      (window as any).plausible(eventName, { props: properties });
    } catch (e) {
      console.warn('Plausible event tracking error:', e);
    }
  }

  // 3. Integration with Google Analytics (gtag) if present
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      (window as any).gtag('event', eventName, properties);
    } catch (e) {
      console.warn('gtag event tracking error:', e);
    }
  }

  // 4. Dispatch custom browser event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('manea_analytics', { detail: eventData }));
  }

  // 5. Store in localStorage for auditing / admin panel tracking
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const existingRaw = localStorage.getItem(STORAGE_KEY);
      const existing: AnalyticsEvent[] = existingRaw ? JSON.parse(existingRaw) : [];
      existing.unshift(eventData);
      if (existing.length > MAX_LOCAL_EVENTS) {
        existing.length = MAX_LOCAL_EVENTS;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch (e) {
      // Silently fail if localStorage is disabled
    }
  }

  // 6. Send beacon to backend if API route is available
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    try {
      const payload = JSON.stringify(eventData);
      navigator.sendBeacon('/api/analytics', payload);
    } catch (e) {
      // Ignore beacon send error
    }
  }
};

export const getStoredAnalytics = (): AnalyticsEvent[] => {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const clearStoredAnalytics = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem(STORAGE_KEY);
  }
};
