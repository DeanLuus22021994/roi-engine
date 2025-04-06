import { calculateROI, ROICalculator, ROIRepository, ROIAnalysis } from './roiAnalysis';

// Helper for creating ROI analyses with default values where needed
function createSampleAnalysis(overrides: Partial<ROIAnalysis> = {}): ROIAnalysis {
  return {
    featureName: 'Test Feature',
    description: 'A test feature for unit testing',
    timeInvestment: {
      development: 40,
      testing: 20,
      deployment: 10,
      maintenance: 30
    },
    monetaryInvestment: {
      laborCost: 5000,
      infrastructureCost: 1000,
      toolingCost: 500
    },
    expectedReturns: {
      timeToMarket: 30,
      userImpact: 5000,
      revenueIncrease: 15000,
      costReduction: 5000,
      marketShareIncrease: 2
    },
    created: new Date(),
    updated: new Date(),
    status: 'completed',
    ...overrides
  };
}

describe('ROI Analysis Tests', () => {
  // Tests for the basic calculateROI function
  describe('calculateROI function', () => {
    test('should calculate ROI correctly for positive values', () => {
      const result = calculateROI(500, 1000);
      expect(result).toBe(200);
    });

    test('should return 0 for zero investment', () => {
      const result = calculateROI(0, 500);
      expect(result).toBe(0);
    });

    test('should handle negative returns gracefully', () => {
      const result = calculateROI(1000, -500);
      expect(result).toBe(-50);
    });
  });

  // Tests for the ROICalculator class
  describe('ROICalculator', () => {
    // Sample data for testing
    const sampleAnalysis = createSampleAnalysis();

    describe('calculateDeveloperCost', () => {
      test('should calculate developer cost correctly', () => {
        const hourlyRate = 50;
        const expectedCost = (40 + 20 + 10 + 30) * hourlyRate;
        const result = ROICalculator.calculateDeveloperCost(sampleAnalysis.timeInvestment, hourlyRate);
        expect(result).toBe(expectedCost);
      });

      test('should return 0 for zero hourly rate', () => {
        const result = ROICalculator.calculateDeveloperCost(sampleAnalysis.timeInvestment, 0);
        expect(result).toBe(0);
      });

      test('should handle zero time investments', () => {
        const zeroTimeInvestment = {
          development: 0,
          testing: 0,
          deployment: 0,
          maintenance: 0
        };
        const result = ROICalculator.calculateDeveloperCost(zeroTimeInvestment, 50);
        expect(result).toBe(0);
      });
    });

    describe('calculateTotalInvestment', () => {
      test('should calculate total investment correctly', () => {
        const expectedInvestment = 5000 + 1000 + 500;
        const result = ROICalculator.calculateTotalInvestment(sampleAnalysis.monetaryInvestment);
        expect(result).toBe(expectedInvestment);
      });

      test('should handle zero investments', () => {
        const zeroInvestment = {
          laborCost: 0,
          infrastructureCost: 0,
          toolingCost: 0
        };
        const result = ROICalculator.calculateTotalInvestment(zeroInvestment);
        expect(result).toBe(0);
      });
    });

    describe('calculateTotalReturns', () => {
      test('should calculate total returns correctly', () => {
        const expectedReturns = 15000 + 5000;
        const result = ROICalculator.calculateTotalReturns(sampleAnalysis.expectedReturns);
        expect(result).toBe(expectedReturns);
      });

      test('should handle zero returns', () => {
        const zeroReturns = {
          timeToMarket: 0,
          userImpact: 0,
          revenueIncrease: 0,
          costReduction: 0,
          marketShareIncrease: 0
        };
        const result = ROICalculator.calculateTotalReturns(zeroReturns);
        expect(result).toBe(0);
      });
    });

    describe('calculateROI', () => {
      test('should calculate ROI percentage correctly', () => {
        const totalInvestment = 6500; // from monetaryInvestment
        const totalReturns = 20000; // from expectedReturns
        const expectedROI = ((totalReturns - totalInvestment) / totalInvestment) * 100;
        const result = ROICalculator.calculateROI(sampleAnalysis);
        expect(result).toBeCloseTo(expectedROI);
      });

      test('should return 0 for zero investment', () => {
        const zeroInvestmentAnalysis = createSampleAnalysis({
          monetaryInvestment: {
            laborCost: 0,
            infrastructureCost: 0,
            toolingCost: 0
          }
        });
        const result = ROICalculator.calculateROI(zeroInvestmentAnalysis);
        expect(result).toBe(0);
      });
      
      test('should handle negative returns', () => {
        const negativeReturnsAnalysis = createSampleAnalysis({
          expectedReturns: {
            timeToMarket: 30,
            userImpact: 5000,
            revenueIncrease: -15000,
            costReduction: 5000,
            marketShareIncrease: 2
          }
        });
        const result = ROICalculator.calculateROI(negativeReturnsAnalysis);
        expect(result).toBeLessThan(0);
      });
    });

    describe('calculatePaybackPeriod', () => {
      test('should calculate payback period correctly', () => {
        const totalInvestment = 6500; // from monetaryInvestment
        const totalReturns = 20000; // from expectedReturns
        const dailyReturn = totalReturns / 365;
        const expectedPeriod = totalInvestment / dailyReturn;
        
        const result = ROICalculator.calculatePaybackPeriod(sampleAnalysis);
        expect(result).toBeCloseTo(expectedPeriod);
      });

      test('should return Infinity for zero returns', () => {
        const zeroReturnsAnalysis = createSampleAnalysis({
          expectedReturns: {
            timeToMarket: 30,
            userImpact: 5000,
            revenueIncrease: 0,
            costReduction: 0,
            marketShareIncrease: 2
          }
        });
        const result = ROICalculator.calculatePaybackPeriod(zeroReturnsAnalysis);
        expect(result).toBe(Infinity);
      });

      test('should handle zero investment', () => {
        const zeroInvestmentAnalysis = createSampleAnalysis({
          monetaryInvestment: {
            laborCost: 0,
            infrastructureCost: 0,
            toolingCost: 0
          }
        });
        const result = ROICalculator.calculatePaybackPeriod(zeroInvestmentAnalysis);
        expect(result).toBe(0);
      });
    });

    describe('calculatePriorityScore', () => {
      test('should calculate priority score correctly', () => {
        const roi = ROICalculator.calculateROI(sampleAnalysis);
        const paybackPeriod = ROICalculator.calculatePaybackPeriod(sampleAnalysis);
        const userImpact = sampleAnalysis.expectedReturns.userImpact;
        
        const paybackScore = 100 / paybackPeriod;
        const expectedScore = (roi * 0.4) + (paybackScore * 0.3) + (Math.min(userImpact / 1000, 100) * 0.3);
        
        const result = ROICalculator.calculatePriorityScore(sampleAnalysis);
        expect(result).toBeCloseTo(expectedScore);
      });

      test('should handle infinite payback period (zero returns)', () => {
        const zeroReturnsAnalysis = createSampleAnalysis({
          expectedReturns: {
            timeToMarket: 30,
            userImpact: 5000,
            revenueIncrease: 0,
            costReduction: 0,
            marketShareIncrease: 2
          }
        });
        
        // In this case, paybackScore = 0 due to Infinity
        const roi = ROICalculator.calculateROI(zeroReturnsAnalysis); // Should be 0
        const userImpact = zeroReturnsAnalysis.expectedReturns.userImpact;
        const expectedScore = (roi * 0.4) + (0 * 0.3) + (Math.min(userImpact / 1000, 100) * 0.3);
        
        const result = ROICalculator.calculatePriorityScore(zeroReturnsAnalysis);
        expect(result).toBeCloseTo(expectedScore);
      });

      test('should cap user impact at 100', () => {
        const highImpactAnalysis = createSampleAnalysis({
          expectedReturns: {
            timeToMarket: 30,
            userImpact: 1000000, // Very high user impact
            revenueIncrease: 15000,
            costReduction: 5000,
            marketShareIncrease: 2
          }
        });
        
        const roi = ROICalculator.calculateROI(highImpactAnalysis);
        const paybackPeriod = ROICalculator.calculatePaybackPeriod(highImpactAnalysis);
        const paybackScore = 100 / paybackPeriod;
        
        // User impact should be capped at 100
        const expectedScore = (roi * 0.4) + (paybackScore * 0.3) + (100 * 0.3);
        
        const result = ROICalculator.calculatePriorityScore(highImpactAnalysis);
        expect(result).toBeCloseTo(expectedScore);
      });
    });
  });

  // Tests for the ROIRepository class
  describe('ROIRepository', () => {
    beforeEach(() => {
      // Reset the repository before each test
      // We need to access the private property using a workaround
      (ROIRepository as any).analyses = [];
    });

    describe('addAnalysis and getAllAnalyses', () => {
      test('should add and retrieve analyses', () => {
        const analysis = createSampleAnalysis({ featureName: 'Test Feature' });
        
        ROIRepository.addAnalysis(analysis);
        const allAnalyses = ROIRepository.getAllAnalyses();
        
        expect(allAnalyses.length).toBe(1);
        expect(allAnalyses[0].featureName).toBe('Test Feature');
      });

      test('should add multiple analyses', () => {
        ROIRepository.addAnalysis(createSampleAnalysis({ featureName: 'Feature 1' }));
        ROIRepository.addAnalysis(createSampleAnalysis({ featureName: 'Feature 2' }));
        ROIRepository.addAnalysis(createSampleAnalysis({ featureName: 'Feature 3' }));
        
        const allAnalyses = ROIRepository.getAllAnalyses();
        expect(allAnalyses.length).toBe(3);
      });

      test('should return a copy of the analyses array', () => {
        ROIRepository.addAnalysis(createSampleAnalysis());
        
        const allAnalyses = ROIRepository.getAllAnalyses();
        const originalLength = allAnalyses.length;
        
        // Modify the returned array
        allAnalyses.push(createSampleAnalysis());
        
        // The original array in the repository should be unchanged
        const newAnalyses = ROIRepository.getAllAnalyses();
        expect(newAnalyses.length).toBe(originalLength);
      });
    });

    describe('getAnalysesByStatus', () => {
      test('should filter analyses by status', () => {
        const completedAnalysis = createSampleAnalysis({
          featureName: 'Completed Feature',
          status: 'completed'
        });

        const proposedAnalysis = createSampleAnalysis({
          featureName: 'Proposed Feature',
          status: 'proposed'
        });

        const inProgressAnalysis = createSampleAnalysis({
          featureName: 'In-Progress Feature',
          status: 'in-progress'
        });

        const abandonedAnalysis = createSampleAnalysis({
          featureName: 'Abandoned Feature',
          status: 'abandoned'
        });

        ROIRepository.addAnalysis(completedAnalysis);
        ROIRepository.addAnalysis(proposedAnalysis);
        ROIRepository.addAnalysis(inProgressAnalysis);
        ROIRepository.addAnalysis(abandonedAnalysis);

        const completedAnalyses = ROIRepository.getAnalysesByStatus('completed');
        expect(completedAnalyses.length).toBe(1);
        expect(completedAnalyses[0].featureName).toBe('Completed Feature');
        
        const proposedAnalyses = ROIRepository.getAnalysesByStatus('proposed');
        expect(proposedAnalyses.length).toBe(1);
        expect(proposedAnalyses[0].featureName).toBe('Proposed Feature');
        
        const inProgressAnalyses = ROIRepository.getAnalysesByStatus('in-progress');
        expect(inProgressAnalyses.length).toBe(1);
        expect(inProgressAnalyses[0].featureName).toBe('In-Progress Feature');
        
        const abandonedAnalyses = ROIRepository.getAnalysesByStatus('abandoned');
        expect(abandonedAnalyses.length).toBe(1);
        expect(abandonedAnalyses[0].featureName).toBe('Abandoned Feature');
      });

      test('should return empty array if no analyses match status', () => {
        ROIRepository.addAnalysis(createSampleAnalysis({ status: 'completed' }));
        
        const proposedAnalyses = ROIRepository.getAnalysesByStatus('proposed');
        expect(proposedAnalyses.length).toBe(0);
      });
    });

    describe('getTopAnalysesByROI', () => {
      test('should return top analyses sorted by ROI', () => {
        const highROIAnalysis = createSampleAnalysis({
          featureName: 'High ROI Feature',
          monetaryInvestment: { laborCost: 1000, infrastructureCost: 200, toolingCost: 100 },
          expectedReturns: { timeToMarket: 15, userImpact: 1000, revenueIncrease: 10000, costReduction: 2000, marketShareIncrease: 5 }
        });
        
        const mediumROIAnalysis = createSampleAnalysis({
          featureName: 'Medium ROI Feature',
          monetaryInvestment: { laborCost: 2000, infrastructureCost: 500, toolingCost: 300 },
          expectedReturns: { timeToMarket: 30, userImpact: 2000, revenueIncrease: 7000, costReduction: 1000, marketShareIncrease: 3 }
        });
        
        const lowROIAnalysis = createSampleAnalysis({
          featureName: 'Low ROI Feature',
          monetaryInvestment: { laborCost: 3000, infrastructureCost: 1000, toolingCost: 500 },
          expectedReturns: { timeToMarket: 45, userImpact: 500, revenueIncrease: 3000, costReduction: 500, marketShareIncrease: 1 }
        });
        
        ROIRepository.addAnalysis(lowROIAnalysis);
        ROIRepository.addAnalysis(highROIAnalysis);
        ROIRepository.addAnalysis(mediumROIAnalysis);
        
        const topROIAnalyses = ROIRepository.getTopAnalysesByROI(2);
        
        expect(topROIAnalyses.length).toBe(2);
        expect(topROIAnalyses[0].featureName).toBe('High ROI Feature');
        expect(topROIAnalyses[1].featureName).toBe('Medium ROI Feature');
      });

      test('should use default limit of 5 when no argument is provided', () => {
        for (let i = 1; i <= 10; i++) {
          ROIRepository.addAnalysis(createSampleAnalysis({ featureName: `Feature ${i}` }));
        }
        
        const topROIAnalyses = ROIRepository.getTopAnalysesByROI();
        expect(topROIAnalyses.length).toBe(5);
      });

      test('should return all analyses if n is greater than available analyses', () => {
        ROIRepository.addAnalysis(createSampleAnalysis({ featureName: 'Feature 1' }));
        ROIRepository.addAnalysis(createSampleAnalysis({ featureName: 'Feature 2' }));
        
        const topROIAnalyses = ROIRepository.getTopAnalysesByROI(10);
        expect(topROIAnalyses.length).toBe(2);
      });

      test('should return empty array if no analyses exist', () => {
        const topROIAnalyses = ROIRepository.getTopAnalysesByROI();
        expect(topROIAnalyses.length).toBe(0);
      });
    });

    describe('getTopAnalysesByPriority', () => {
      test('should return top analyses sorted by priority score', () => {
        const highPriorityAnalysis = createSampleAnalysis({
          featureName: 'High Priority Feature',
          monetaryInvestment: { laborCost: 1000, infrastructureCost: 200, toolingCost: 100 },
          expectedReturns: { timeToMarket: 15, userImpact: 10000, revenueIncrease: 10000, costReduction: 2000, marketShareIncrease: 5 }
        });
        
        const mediumPriorityAnalysis = createSampleAnalysis({
          featureName: 'Medium Priority Feature',
          monetaryInvestment: { laborCost: 2000, infrastructureCost: 500, toolingCost: 300 },
          expectedReturns: { timeToMarket: 30, userImpact: 5000, revenueIncrease: 7000, costReduction: 1000, marketShareIncrease: 3 }
        });
        
        const lowPriorityAnalysis = createSampleAnalysis({
          featureName: 'Low Priority Feature',
          monetaryInvestment: { laborCost: 3000, infrastructureCost: 1000, toolingCost: 500 },
          expectedReturns: { timeToMarket: 45, userImpact: 500, revenueIncrease: 3000, costReduction: 500, marketShareIncrease: 1 }
        });
        
        ROIRepository.addAnalysis(lowPriorityAnalysis);
        ROIRepository.addAnalysis(highPriorityAnalysis);
        ROIRepository.addAnalysis(mediumPriorityAnalysis);
        
        const topPriorityAnalyses = ROIRepository.getTopAnalysesByPriority(2);
        
        expect(topPriorityAnalyses.length).toBe(2);
        expect(topPriorityAnalyses[0].featureName).toBe('High Priority Feature');
        expect(topPriorityAnalyses[1].featureName).toBe('Medium Priority Feature');
      });

      test('should use default limit of 5 when no argument is provided', () => {
        for (let i = 1; i <= 10; i++) {
          ROIRepository.addAnalysis(createSampleAnalysis({ featureName: `Feature ${i}` }));
        }
        
        const topPriorityAnalyses = ROIRepository.getTopAnalysesByPriority();
        expect(topPriorityAnalyses.length).toBe(5);
      });

      test('should return all analyses if n is greater than available analyses', () => {
        ROIRepository.addAnalysis(createSampleAnalysis({ featureName: 'Feature 1' }));
        ROIRepository.addAnalysis(createSampleAnalysis({ featureName: 'Feature 2' }));
        
        const topPriorityAnalyses = ROIRepository.getTopAnalysesByPriority(10);
        expect(topPriorityAnalyses.length).toBe(2);
      });

      test('should return empty array if no analyses exist', () => {
        const topPriorityAnalyses = ROIRepository.getTopAnalysesByPriority();
        expect(topPriorityAnalyses.length).toBe(0);
      });
    });

    describe('updateAnalysis', () => {
      test('should update an existing analysis', () => {
        ROIRepository.addAnalysis(createSampleAnalysis({ 
          featureName: 'Original Feature',
          description: 'Original description',
          status: 'proposed'
        }));
        
        const updates = {
          description: 'Updated description',
          status: 'in-progress' as const
        };
        
        const updatedAnalysis = ROIRepository.updateAnalysis('Original Feature', updates);
        
        expect(updatedAnalysis).not.toBeNull();
        expect(updatedAnalysis!.featureName).toBe('Original Feature');
        expect(updatedAnalysis!.description).toBe('Updated description');
        expect(updatedAnalysis!.status).toBe('in-progress');
      });

      test('should preserve unmodified fields', () => {
        const original = createSampleAnalysis({ 
          featureName: 'Feature Name',
          description: 'Original description',
          status: 'proposed'
        });
        
        ROIRepository.addAnalysis(original);
        
        const updates = {
          description: 'Updated description'
        };
        
        const updatedAnalysis = ROIRepository.updateAnalysis('Feature Name', updates);
        
        expect(updatedAnalysis!.status).toBe('proposed');
        expect(updatedAnalysis!.timeInvestment).toEqual(original.timeInvestment);
        expect(updatedAnalysis!.monetaryInvestment).toEqual(original.monetaryInvestment);
        expect(updatedAnalysis!.expectedReturns).toEqual(original.expectedReturns);
      });

      test('should return null if analysis is not found', () => {
        ROIRepository.addAnalysis(createSampleAnalysis({ featureName: 'Existing Feature' }));
        
        const updatedAnalysis = ROIRepository.updateAnalysis('Non-existent Feature', {
          description: 'New description'
        });
        
        expect(updatedAnalysis).toBeNull();
      });

      test('should update the updated timestamp', () => {
        const originalDate = new Date(2025, 3, 1); // April 1, 2025
        
        ROIRepository.addAnalysis(createSampleAnalysis({ 
          featureName: 'Date Test Feature',
          updated: originalDate
        }));
        
        // Mock Date.now to return a specific timestamp
        const originalNow = Date.now;
        const mockNow = new Date(2025, 3, 5).getTime(); // April 5, 2025
        global.Date.now = jest.fn(() => mockNow);
        
        const updatedAnalysis = ROIRepository.updateAnalysis('Date Test Feature', {
          description: 'Updated description'
        });
        
        // Restore original Date.now
        global.Date.now = originalNow;
        
        expect(updatedAnalysis!.updated.getTime()).toBe(mockNow);
        expect(updatedAnalysis!.updated).not.toEqual(originalDate);
      });
    });

    describe('generateSummaryReport', () => {
      test('should generate a complete summary report', () => {
        // Add analyses with different statuses
        ROIRepository.addAnalysis(createSampleAnalysis({
          featureName: 'Completed Feature 1',
          status: 'completed',
          monetaryInvestment: { laborCost: 1000, infrastructureCost: 200, toolingCost: 100 },
          expectedReturns: { timeToMarket: 15, userImpact: 1000, revenueIncrease: 3000, costReduction: 1000, marketShareIncrease: 1 }
        }));
        
        ROIRepository.addAnalysis(createSampleAnalysis({
          featureName: 'Completed Feature 2',
          status: 'completed',
          monetaryInvestment: { laborCost: 2000, infrastructureCost: 300, toolingCost: 200 },
          expectedReturns: { timeToMarket: 20, userImpact: 2000, revenueIncrease: 5000, costReduction: 2000, marketShareIncrease: 2 }
        }));
        
        ROIRepository.addAnalysis(createSampleAnalysis({
          featureName: 'In Progress Feature',
          status: 'in-progress',
          monetaryInvestment: { laborCost: 3000, infrastructureCost: 400, toolingCost: 300 },
          expectedReturns: { timeToMarket: 25, userImpact: 3000, revenueIncrease: 7000, costReduction: 3000, marketShareIncrease: 3 }
        }));
        
        ROIRepository.addAnalysis(createSampleAnalysis({
          featureName: 'Proposed Feature',
          status: 'proposed',
          monetaryInvestment: { laborCost: 4000, infrastructureCost: 500, toolingCost: 400 },
          expectedReturns: { timeToMarket: 30, userImpact: 4000, revenueIncrease: 9000, costReduction: 4000, marketShareIncrease: 4 }
        }));
        
        const report = ROIRepository.generateSummaryReport();
        
        // Verify the summary section
        expect(report.summary).toBeTruthy();
        expect(report.summary.totalFeatures).toBe(4);
        expect(report.summary.completedFeatures).toBe(2);
        expect(report.summary.inProgressFeatures).toBe(1);
        expect(report.summary.proposedFeatures).toBe(1);
        
        // Verify the top features sections
        expect(report.topROIFeatures).toBeTruthy();
        expect(report.topROIFeatures.length).toBe(3);
        
        expect(report.topPriorityFeatures).toBeTruthy();
        expect(report.topPriorityFeatures.length).toBe(3);
      });

      test('should handle empty repository', () => {
        const report = ROIRepository.generateSummaryReport();
        
        expect(report.summary.totalFeatures).toBe(0);
        expect(report.summary.completedFeatures).toBe(0);
        expect(report.summary.inProgressFeatures).toBe(0);
        expect(report.summary.proposedFeatures).toBe(0);
        expect(report.summary.averageCompletedROI).toBe('0.00%');
        expect(report.summary.totalInvestment).toBe('0.00');
        expect(report.summary.totalReturns).toBe('0.00');
        expect(report.summary.overallROI).toBe('N/A');
        
        expect(report.topROIFeatures.length).toBe(0);
        expect(report.topPriorityFeatures.length).toBe(0);
      });

      test('should calculate correct average ROI for completed features', () => {
        // Add two completed features with different ROIs
        ROIRepository.addAnalysis(createSampleAnalysis({
          featureName: 'Completed Feature 1',
          status: 'completed',
          monetaryInvestment: { laborCost: 1000, infrastructureCost: 200, toolingCost: 100 }, // Total: 1300
          expectedReturns: { timeToMarket: 15, userImpact: 1000, revenueIncrease: 2000, costReduction: 600, marketShareIncrease: 1 } // Total: 2600
          // ROI: (2600 - 1300) / 1300 * 100 = 100%
        }));
        
        ROIRepository.addAnalysis(createSampleAnalysis({
          featureName: 'Completed Feature 2',
          status: 'completed',
          monetaryInvestment: { laborCost: 2000, infrastructureCost: 300, toolingCost: 200 }, // Total: 2500
          expectedReturns: { timeToMarket: 20, userImpact: 2000, revenueIncrease: 5000, costReduction: 2500, marketShareIncrease: 2 } // Total: 7500
          // ROI: (7500 - 2500) / 2500 * 100 = 200%
        }));
        
        const report = ROIRepository.generateSummaryReport();
        
        // Average ROI: (100% + 200%) / 2 = 150%
        expect(report.summary.averageCompletedROI).toBe('150.00%');
      });

      test('should calculate correct overall ROI', () => {
        // Add features with various statuses
        ROIRepository.addAnalysis(createSampleAnalysis({
          featureName: 'Completed Feature',
          status: 'completed',
          monetaryInvestment: { laborCost: 1000, infrastructureCost: 200, toolingCost: 100 }, // Total: 1300
          expectedReturns: { timeToMarket: 15, userImpact: 1000, revenueIncrease: 2000, costReduction: 1000, marketShareIncrease: 1 } // Total: 3000
        }));
        
        ROIRepository.addAnalysis(createSampleAnalysis({
          featureName: 'In Progress Feature',
          status: 'in-progress',
          monetaryInvestment: { laborCost: 2000, infrastructureCost: 300, toolingCost: 200 }, // Total: 2500
          expectedReturns: { timeToMarket: 20, userImpact: 2000, revenueIncrease: 0, costReduction: 0, marketShareIncrease: 2 } // Not counted in returns
        }));
        
        const report = ROIRepository.generateSummaryReport();
        
        // Total investment: 1300 + 2500 = 3800
        expect(report.summary.totalInvestment).toBe('3800.00');
        
        // Total returns (only from completed): 3000
        expect(report.summary.totalReturns).toBe('3000.00');
        
        // Overall ROI: (3000 - 3800) / 3800 * 100 = -21.05%
        expect(report.summary.overallROI).toBe('-21.05%');
      });

      test('should handle zero total investment', () => {
        // Add a completed feature with zero investment
        ROIRepository.addAnalysis(createSampleAnalysis({
          featureName: 'Zero Investment Feature',
          status: 'completed',
          monetaryInvestment: { laborCost: 0, infrastructureCost: 0, toolingCost: 0 },
          expectedReturns: { timeToMarket: 15, userImpact: 1000, revenueIncrease: 1000, costReduction: 500, marketShareIncrease: 1 }
        }));
        
        const report = ROIRepository.generateSummaryReport();
        
        expect(report.summary.totalInvestment).toBe('0.00');
        expect(report.summary.totalReturns).toBe('1500.00');
        expect(report.summary.overallROI).toBe('N/A'); // Cannot calculate ROI with zero investment
      });
    });
  });
});