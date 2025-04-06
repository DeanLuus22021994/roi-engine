/**
 * ROI Analysis Utility for Development Decisions
 * 
 * This module helps track and calculate ROI (Return on Investment) for development efforts,
 * allowing teams to prioritize work with the highest impact.
 */

type TimeInvestment = {
  development: number; // Hours spent on development
  testing: number; // Hours spent on testing
  deployment: number; // Hours spent on deployment
  maintenance: number; // Expected hours for maintenance
};

type MonetaryInvestment = {
  laborCost: number; // Cost of developer time
  infrastructureCost: number; // Cost of servers, services, etc.
  toolingCost: number; // Cost of tools and licenses
};

type ExpectedReturns = {
  timeToMarket: number; // Days until feature reaches users
  userImpact: number; // Number of users impacted
  revenueIncrease: number; // Expected revenue increase
  costReduction: number; // Expected cost reduction
  marketShareIncrease: number; // Expected market share increase
};

export type ROIAnalysis = {
  featureName: string;
  description: string;
  timeInvestment: TimeInvestment;
  monetaryInvestment: MonetaryInvestment;
  expectedReturns: ExpectedReturns;
  created: Date;
  updated: Date;
  status: 'proposed' | 'in-progress' | 'completed' | 'abandoned';
};

export function calculateROI(investment: number, returns: number): number {
  if (investment === 0) return 0;
  return (returns / investment) * 100;
}

export class ROICalculator {
  // Calculate developer cost
  static calculateDeveloperCost(timeInvestment: TimeInvestment, hourlyRate: number): number {
    const totalHours = 
      timeInvestment.development + 
      timeInvestment.testing + 
      timeInvestment.deployment + 
      timeInvestment.maintenance;
    
    return totalHours * hourlyRate;
  }
  
  // Calculate total investment
  static calculateTotalInvestment(monetaryInvestment: MonetaryInvestment): number {
    return (
      monetaryInvestment.laborCost + 
      monetaryInvestment.infrastructureCost + 
      monetaryInvestment.toolingCost
    );
  }
  
  // Calculate total returns
  static calculateTotalReturns(expectedReturns: ExpectedReturns): number {
    return expectedReturns.revenueIncrease + expectedReturns.costReduction;
  }
  
  // Calculate ROI as a percentage
  static calculateROI(analysis: ROIAnalysis): number {
    const totalInvestment = this.calculateTotalInvestment(analysis.monetaryInvestment);
    const totalReturns = this.calculateTotalReturns(analysis.expectedReturns);
    
    if (totalInvestment === 0) return 0;
    
    return ((totalReturns - totalInvestment) / totalInvestment) * 100;
  }
  
  // Calculate payback period in days
  static calculatePaybackPeriod(analysis: ROIAnalysis): number {
    const totalInvestment = this.calculateTotalInvestment(analysis.monetaryInvestment);
    const totalReturns = this.calculateTotalReturns(analysis.expectedReturns);
    
    if (totalReturns === 0) return Infinity;
    
    // Daily return rate
    const dailyReturn = totalReturns / 365;
    
    return totalInvestment / dailyReturn;
  }
  
  // Priority score for development decision making
  static calculatePriorityScore(analysis: ROIAnalysis): number {
    const roi = this.calculateROI(analysis);
    const paybackPeriod = this.calculatePaybackPeriod(analysis);
    const userImpact = analysis.expectedReturns.userImpact;
    
    // Lower payback period is better, so we invert it
    const paybackScore = paybackPeriod === Infinity ? 0 : 100 / paybackPeriod;
    
    // Weighted priority score
    return (
      (roi * 0.4) + // 40% weight to ROI
      (paybackScore * 0.3) + // 30% weight to payback period
      (Math.min(userImpact / 1000, 100) * 0.3) // 30% weight to user impact (capped at 100)
    );
  }
}

// Sample repository of ROI analyses
export class ROIRepository {
  private static analyses: ROIAnalysis[] = [];
  
  // Add a new ROI analysis
  static addAnalysis(analysis: ROIAnalysis): void {
    this.analyses.push({
      ...analysis,
      created: new Date(),
      updated: new Date()
    });
  }
  
  // Get all analyses
  static getAllAnalyses(): ROIAnalysis[] {
    return [...this.analyses];
  }
  
  // Get analyses by status
  static getAnalysesByStatus(status: ROIAnalysis['status']): ROIAnalysis[] {
    return this.analyses.filter(analysis => analysis.status === status);
  }
  
  // Get top N analyses by ROI
  static getTopAnalysesByROI(n: number = 5): ROIAnalysis[] {
    return [...this.analyses]
      .sort((a, b) => ROICalculator.calculateROI(b) - ROICalculator.calculateROI(a))
      .slice(0, n);
  }
  
  // Get top N analyses by priority score
  static getTopAnalysesByPriority(n: number = 5): ROIAnalysis[] {
    return [...this.analyses]
      .sort((a, b) => ROICalculator.calculatePriorityScore(b) - ROICalculator.calculatePriorityScore(a))
      .slice(0, n);
  }
  
  // Update an existing analysis
  static updateAnalysis(featureName: string, updates: Partial<ROIAnalysis>): ROIAnalysis | null {
    const index = this.analyses.findIndex(a => a.featureName === featureName);
    
    if (index === -1) return null;
    
    this.analyses[index] = {
      ...this.analyses[index],
      ...updates,
      updated: new Date()
    };
    
    return this.analyses[index];
  }
  
  // Generate summary report
  static generateSummaryReport(): Record<string, unknown> {
    const completedAnalyses = this.getAnalysesByStatus('completed');
    const inProgressAnalyses = this.getAnalysesByStatus('in-progress');
    const proposedAnalyses = this.getAnalysesByStatus('proposed');
    
    // Calculate average ROI for completed features
    const averageCompletedROI = completedAnalyses.length > 0
      ? completedAnalyses.reduce((sum, analysis) => sum + ROICalculator.calculateROI(analysis), 0) / completedAnalyses.length
      : 0;
    
    // Calculate total investment across all features
    const totalInvestment = this.analyses.reduce(
      (sum, analysis) => sum + ROICalculator.calculateTotalInvestment(analysis.monetaryInvestment),
      0
    );
    
    // Calculate total returns from completed features
    const totalReturns = completedAnalyses.reduce(
      (sum, analysis) => sum + ROICalculator.calculateTotalReturns(analysis.expectedReturns),
      0
    );
    
    return {
      summary: {
        totalFeatures: this.analyses.length,
        completedFeatures: completedAnalyses.length,
        inProgressFeatures: inProgressAnalyses.length,
        proposedFeatures: proposedAnalyses.length,
        averageCompletedROI: averageCompletedROI.toFixed(2) + '%',
        totalInvestment: totalInvestment.toFixed(2),
        totalReturns: totalReturns.toFixed(2),
        overallROI: totalInvestment > 0 
          ? (((totalReturns - totalInvestment) / totalInvestment) * 100).toFixed(2) + '%'
          : 'N/A'
      },
      topROIFeatures: this.getTopAnalysesByROI(3).map(a => ({
        name: a.featureName,
        roi: ROICalculator.calculateROI(a).toFixed(2) + '%',
        status: a.status
      })),
      topPriorityFeatures: this.getTopAnalysesByPriority(3).map(a => ({
        name: a.featureName,
        priority: ROICalculator.calculatePriorityScore(a).toFixed(2),
        status: a.status
      }))
    };
  }
}