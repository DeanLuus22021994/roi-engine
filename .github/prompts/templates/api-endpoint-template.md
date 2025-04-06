# API Endpoint Template: ROI-Optimized Implementation

Use this template when creating new API endpoints to ensure they follow best practices for security, performance, and error handling.

## API Endpoint Structure

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod'; // For input validation
import { ContextAwarenessSystem } from '@/utils/contextAwareness';

// Define response data type
interface ResponseData {
  success: boolean;
  data?: any;
  error?: string;
}

// Input validation schema using Zod
const requestSchema = z.object({
  // Define request body schema with explicit types and validation rules
  id: z.string().uuid().optional(),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  // Add more fields as needed
});

// Type inference from schema
type RequestData = z.infer<typeof requestSchema>;

/**
 * Handler for /api/resource endpoint
 * 
 * @description This endpoint handles CRUD operations for resources
 * 
 * @example
 * // GET /api/resource
 * fetch('/api/resource')
 * 
 * @example
 * // POST /api/resource
 * fetch('/api/resource', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ name: 'Example', email: 'test@example.com' })
 * })
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Get context awareness system for tracking
  const system = ContextAwarenessSystem.getInstance();
  
  // Track API request for analytics
  system.trackFeatureUsage(`API_${req.method}_resource`);
  
  // Performance tracking
  const startTime = performance.now();
  
  try {
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      case 'PUT':
        return await handlePut(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        // Method not allowed
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ 
          success: false,
          error: `Method ${req.method} Not Allowed` 
        });
    }
  } catch (error) {
    // Track error with context
    if (error instanceof Error) {
      system.trackError(error, {
        endpoint: '/api/resource',
        method: req.method,
        query: req.query,
        // Don't include full body in error tracking to avoid logging sensitive data
        hasBody: !!req.body,
      });
    }
    
    // Determine if client error or server error
    const statusCode = error instanceof z.ZodError ? 400 : 500;
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred';
    
    // Return appropriate error response
    return res.status(statusCode).json({
      success: false,
      error: errorMessage
    });
  } finally {
    // Track performance
    const endTime = performance.now();
    system.measurePerformance(`API_${req.method}_resource`, endTime - startTime);
  }
}

/**
 * Handle GET requests
 */
async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Extract query parameters with validation
  const { id } = req.query;
  
  // If ID is provided, get specific resource
  if (id) {
    // Validate id format
    if (typeof id !== 'string' || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }
    
    // Get resource by ID (placeholder)
    const resource = { id, name: 'Example', email: 'test@example.com' };
    
    return res.status(200).json({
      success: true,
      data: resource
    });
  }
  
  // Get all resources (with pagination)
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  
  // Validate pagination parameters
  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      success: false,
      error: 'Invalid pagination parameters'
    });
  }
  
  // Get resources with pagination (placeholder)
  const resources = [
    { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Example 1', email: 'test1@example.com' },
    { id: '123e4567-e89b-12d3-a456-426614174001', name: 'Example 2', email: 'test2@example.com' },
  ];
  
  return res.status(200).json({
    success: true,
    data: {
      items: resources,
      page,
      limit,
      total: resources.length,
      pages: Math.ceil(resources.length / limit)
    }
  });
}

/**
 * Handle POST requests
 */
async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Validate request body against schema
  const validationResult = requestSchema.safeParse(req.body);
  
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid request data',
      data: validationResult.error.format()
    });
  }
  
  // Extract validated data
  const { name, email } = validationResult.data;
  
  // Create resource (placeholder)
  const newResource = {
    id: '123e4567-e89b-12d3-a456-426614174002',
    name,
    email,
    createdAt: new Date().toISOString()
  };
  
  return res.status(201).json({
    success: true,
    data: newResource
  });
}

/**
 * Handle PUT requests
 */
async function handlePut(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Extract ID from query
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'ID is required'
    });
  }
  
  // Validate request body against schema (making all fields optional for updates)
  const updateSchema = requestSchema.partial();
  const validationResult = updateSchema.safeParse(req.body);
  
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid request data',
      data: validationResult.error.format()
    });
  }
  
  // Extract validated data
  const updateData = validationResult.data;
  
  // Update resource (placeholder)
  const updatedResource = {
    id,
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  return res.status(200).json({
    success: true,
    data: updatedResource
  });
}

/**
 * Handle DELETE requests
 */
async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Extract ID from query
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'ID is required'
    });
  }
  
  // Delete resource (placeholder)
  // const result = await db.delete('resource').where('id', id);
  
  return res.status(200).json({
    success: true,
    data: { id, deleted: true }
  });
}
```

## ROI-Focused Implementation Checklist

### Security (Highest ROI)

- [ ] Validate all input data with schema validation
- [ ] Prevent SQL injection in database queries
- [ ] Implement proper authentication middleware
- [ ] Rate limiting for abuse prevention
- [ ] Don't log sensitive data in error tracking

### Error Handling (High ROI)

- [ ] Consistent error response format
- [ ] Validation errors return helpful messages
- [ ] Error tracking with context
- [ ] Appropriate HTTP status codes

### Performance (High ROI)

- [ ] Pagination for list endpoints
- [ ] Limit response data size
- [ ] Implement caching where appropriate
- [ ] Track performance metrics for optimization

### Maintainability (Medium ROI)

- [ ] Separate handler functions by HTTP method
- [ ] Consistent response format
- [ ] Type definitions for request/response data
- [ ] API documentation with examples

## Testing Strategy

```typescript
import { createMocks } from 'node-mocks-http';
import handler from './handler';

jest.mock('@/utils/contextAwareness', () => ({
  ContextAwarenessSystem: {
    getInstance: () => ({
      trackFeatureUsage: jest.fn(),
      trackError: jest.fn(),
      measurePerformance: jest.fn(),
    }),
  },
}));

describe('Resource API', () => {
  test('GET returns list of resources', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data.items)).toBe(true);
  });

  test('GET with ID returns single resource', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { id: '123e4567-e89b-12d3-a456-426614174000' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.data.id).toBe('123e4567-e89b-12d3-a456-426614174000');
  });

  test('POST with valid data creates resource', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Test Name',
        email: 'test@example.com',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.data.name).toBe('Test Name');
  });

  test('POST with invalid data returns 400', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'A', // Too short according to schema
        email: 'invalid-email', // Invalid format
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
  });

  test('DELETE with ID deletes resource', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
      query: { id: '123e4567-e89b-12d3-a456-426614174000' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.data.deleted).toBe(true);
  });
});
```
