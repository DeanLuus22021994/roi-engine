import { useEffect } from 'react';

// Error tracking and monitoring system
class ContextAwarenessSystem {
  private static instance: ContextAwarenessSystem;
  private errors: Array<{
    message: string;
    stack?: string;
    context: Record<string, any>;
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
    // Initialize error tracking
    this.setupErrorTracking();
    
    // Initialize performance monitoring
    this.setupPerformanceMonitoring();
    
    // Regular reporting for retrospectives
    this.scheduleRetrospectives();
  }
  
  public static getInstance(): ContextAwarenessSystem {
    if (!ContextAwarenessSystem.instance) {
      ContextAwarenessSystem.instance = new ContextAwarenessSystem();
    }
    return ContextAwarenessSystem.instance;
  }
  
  // Track runtime errors with context
  public trackError(error: Error, context: Record<string, any> = {}): void {
    this.errors.push({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now()
    });
    
    console.error('Error tracked:', error.message, context);
    
    // In a real implementation, this would send to a service like Sentry
    // this.sendToErrorService(error, context);
    
    // Analyze for patterns - convergence on error resolution
    this.analyzeErrorPatterns();
  }
  
  // Track component or feature usage for enhancement identification
  public trackFeatureUsage(featureName: string): void {
    if (!this.featureUsage[featureName]) {
      this.featureUsage[featureName] = {
        count: 0,
        lastUsed: 0
      };
    }
    
    this.featureUsage[featureName].count++;
    this.featureUsage[featureName].lastUsed = Date.now();
    
    // In a real implementation, this might send to an analytics service
    // this.sendToAnalyticsService(featureName);
  }
  
  // Measure performance of operations
  public measurePerformance(operationName: string, durationMs: number): void {
    if (!this.performanceMetrics[operationName]) {
      this.performanceMetrics[operationName] = {
        measurements: [],
        average: 0
      };
    }
    
    const metrics = this.performanceMetrics[operationName];
    metrics.measurements.push(durationMs);
    
    // Recalculate average
    const total = metrics.measurements.reduce((sum, value) => sum + value, 0);
    metrics.average = total / metrics.measurements.length;
    
    // Log slow operations for attention - focus on ROI
    if (durationMs > metrics.average * 1.5) {
      console.warn(`Slow operation detected: ${operationName} took ${durationMs}ms (avg: ${metrics.average.toFixed(2)}ms)`);
    }
  }
  
  // Get insights for retrospective
  public generateRetrospectiveData(): Record<string, any> {
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
    // Global error handler
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
        this.trackError(
          new Error(`Unhandled promise rejection: ${event.reason}`), 
          { reason: event.reason }
        );
      });
    }
  }
  
  private setupPerformanceMonitoring(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        // Monitor page loads
        const navigationObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              this.measurePerformance('pageLoad', entry.duration);
            }
          }
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
        
        // Monitor long tasks
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
  
  private analyzeErrorPatterns(): any[] {
    // Simple pattern analysis - group similar errors
    const errorGroups: Record<string, number> = {};
    
    this.errors.forEach(error => {
      const key = error.message.split(':')[0]; // Simple grouping by error prefix
      errorGroups[key] = (errorGroups[key] || 0) + 1;
    });
    
    // Convert to array and sort by frequency
    return Object.entries(errorGroups)
      .map(([pattern, count]) => ({ pattern, count }))
      .sort((a, b) => b.count - a.count);
  }
  
  private scheduleRetrospectives(): void {
    // Weekly retrospectives in real app
    // For demo purposes, we'll log every minute
    if (typeof window !== 'undefined') {
      setInterval(() => {
        const data = this.generateRetrospectiveData();
        console.info('Weekly retrospective data:', data);
        
        // In a real implementation, this could:
        // 1. Send to a dashboard service
        // 2. Generate a report file
        // 3. Send an email summary
      }, 60000); // Every minute for demo
    }
  }
}

// React hook to use the context awareness system
export function useContextAwareness() {
  const system = ContextAwarenessSystem.getInstance();
  
  return {
    trackError: system.trackError.bind(system),
    trackFeatureUsage: system.trackFeatureUsage.bind(system),
    measurePerformance: system.measurePerformance.bind(system),
    generateRetrospectiveData: system.generateRetrospectiveData.bind(system)
  };
}

// Performance measurement wrapper hook
export function usePerformanceTracking(operationName: string) {
  const { measurePerformance } = useContextAwareness();
  
  return (callback: Function) => {
    const startTime = performance.now();
    try {
      return callback();
    } finally {
      const endTime = performance.now();
      measurePerformance(operationName, endTime - startTime);
    }
  };
}

// Error boundary component with context awareness
export function withErrorTracking<P>(Component: React.ComponentType<P>) {
  return function ErrorTrackedComponent(props: P) {
    const { trackError } = useContextAwareness();
    
    useEffect(() => {
      return () => {
        // Cleanup if needed
      };
    }, []);
    
    try {
      return <Component {...props} />;
    } catch (error) {
      trackError(error as Error, { componentProps: props });
      return <div>Something went wrong. The error has been reported.</div>;
    }
  };
}