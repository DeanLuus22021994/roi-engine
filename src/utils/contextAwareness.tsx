import React from 'react';

// Error tracking and monitoring system
class ContextAwarenessSystem {
  private static instance: ContextAwarenessSystem;
  private errors: Array<{
    message: string;
    stack?: string;
    context: Record<string, unknown>;
    timestamp: number;
  }> = [];

  private performanceMetrics: Record<string, {
    measurements: number[];
    average: number;
  }> = {};

  private featureUsage: Record<string, {
    count: number;
    lastUsed: number;
  }> = {};

  private constructor() {
    this.setupErrorTracking();
    this.setupPerformanceMonitoring();
    this.scheduleRetrospectives();
  }

  public static getInstance(): ContextAwarenessSystem {
    if (!ContextAwarenessSystem.instance) {
      ContextAwarenessSystem.instance = new ContextAwarenessSystem();
    }
    return ContextAwarenessSystem.instance;
  }

  public trackError(error: Error, context: Record<string, unknown> = {}): void {
    this.errors.push({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now()
    });
    console.error('Error tracked:', error.message, context);
    this.analyzeErrorPatterns();
  }

  public trackFeatureUsage(featureName: string): void {
    if (!this.featureUsage[featureName]) {
      this.featureUsage[featureName] = { count: 0, lastUsed: 0 };
    }
    this.featureUsage[featureName].count++;
    this.featureUsage[featureName].lastUsed = Date.now();
  }

  public measurePerformance(operationName: string, durationMs: number): void {
    if (!this.performanceMetrics[operationName]) {
      this.performanceMetrics[operationName] = { measurements: [], average: 0 };
    }
    const metrics = this.performanceMetrics[operationName];
    metrics.measurements.push(durationMs);
    const total = metrics.measurements.reduce((sum, value) => sum + value, 0);
    metrics.average = total / metrics.measurements.length;
    if (durationMs > metrics.average * 1.5) {
      console.warn(`Slow operation detected: ${operationName} took ${durationMs}ms (avg: ${metrics.average.toFixed(2)}ms)`);
    }
  }

  public generateRetrospectiveData(): Record<string, unknown> {
    return {
      errorsSummary: {
        count: this.errors.length,
        mostRecentErrors: this.errors.slice(-5).map(e => ({
          message: e.message,
          timestamp: new Date(e.timestamp).toISOString()
        })),
        errorPatterns: this.analyzeErrorPatterns()
      },
      performanceSummary: Object.entries(this.performanceMetrics).map(([name, data]) => ({
        operation: name,
        averageTime: data.average.toFixed(2) + 'ms',
        measurements: data.measurements.length
      })),
      featureUsageSummary: Object.entries(this.featureUsage)
        .sort((a, b) => b[1].count - a[1].count)
        .map(([name, data]) => ({
          feature: name,
          usageCount: data.count,
          lastUsed: new Date(data.lastUsed).toISOString()
        }))
    };
  }

  private setupErrorTracking(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.trackError(event.error, {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        });
      });
      window.addEventListener('unhandledrejection', (event) => {
        this.trackError(new Error(`Unhandled promise rejection: ${event.reason}`), { reason: event.reason });
      });
    }
  }

  private setupPerformanceMonitoring(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              this.measurePerformance('pageLoad', entry.duration);
            }
          }
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });

        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.measurePerformance('longTask', entry.duration);
            console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.error('PerformanceObserver setup failed:', e);
      }
    }
  }

  private analyzeErrorPatterns(): Array<{ pattern: string; count: number }> {
    const errorGroups: Record<string, number> = {};
    this.errors.forEach(error => {
      const key = error.message.split(':')[0];
      errorGroups[key] = (errorGroups[key] || 0) + 1;
    });
    return Object.entries(errorGroups)
      .map(([pattern, count]) => ({ pattern, count }))
      .sort((a, b) => b.count - a.count);
  }

  private scheduleRetrospectives(): void {
    if (typeof window !== 'undefined') {
      setInterval(() => {
        const data = this.generateRetrospectiveData();
        console.info('Weekly retrospective data:', data);
      }, 60000);
    }
  }
}

export function useContextAwareness() {
  const system = ContextAwarenessSystem.getInstance();
  return {
    trackError: system.trackError.bind(system),
    trackFeatureUsage: system.trackFeatureUsage.bind(system),
    measurePerformance: system.measurePerformance.bind(system),
    generateRetrospectiveData: system.generateRetrospectiveData.bind(system)
  };
}

export function usePerformanceTracking<T>(operationName: string) {
  const { measurePerformance } = useContextAwareness();
  return (callback: () => T): T => {
    const startTime = performance.now();
    try {
      return callback();
    } finally {
      const endTime = performance.now();
      measurePerformance(operationName, endTime - startTime);
    }
  };
}

export function withErrorTracking<P>(Component: React.ComponentType<P>) {
  return class ErrorTrackedComponent extends React.Component<P, { hasError: boolean }> {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      const system = ContextAwarenessSystem.getInstance();
      system.trackError(error, { componentProps: this.props, errorInfo });
      this.setState({ hasError: true });
    }

    render() {
      if (this.state.hasError) {
        return <div>Something went wrong. The error has been reported.</div>;
      }
      return <Component {...this.props} />;
    }
  };
}

export function getContextValue(key: string, context: Record<string, any>): any {
  return context[key];
}