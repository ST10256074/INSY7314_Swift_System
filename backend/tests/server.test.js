import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Create a test app with the same middleware as the main server
const createTestApp = () => {
  const app = express();
  
  // Rate limiting middleware
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: true,
  });
  app.use(limiter);

  // Prevent Clickjacking
  app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    next();
  });

  // Configure CORS
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3000',
    'https://localhost:3001',
    'http://localhost:8080',
    'https://localhost:8443'
  ];

  const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
    optionsSuccessStatus: 200
  };

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Test routes
  app.get('/', (req, res) => {
    res.send('SWIFT PAYMENT SYSTEM - Backend Server is running');
  });

  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0'
    });
  });

  return app;
};

describe('Server Middleware Tests', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('Rate Limiting', () => {
    test('should allow requests within rate limit', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.headers['x-ratelimit-limit']).toBeDefined();
      expect(response.headers['x-ratelimit-remaining']).toBeDefined();
    });

    test('should include rate limit headers', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.headers).toHaveProperty('x-ratelimit-limit');
      expect(response.headers).toHaveProperty('x-ratelimit-remaining');
      expect(response.headers).toHaveProperty('x-ratelimit-reset');
    });

    test('should track rate limit usage', async () => {
      // Make multiple requests to test rate limiting
      const responses = await Promise.all([
        request(app).get('/api/health'),
        request(app).get('/api/health'),
        request(app).get('/api/health')
      ]);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.headers['x-ratelimit-remaining']).toBeDefined();
      });

      // Check that remaining count decreases
      const remaining1 = parseInt(responses[0].headers['x-ratelimit-remaining']);
      const remaining2 = parseInt(responses[1].headers['x-ratelimit-remaining']);
      const remaining3 = parseInt(responses[2].headers['x-ratelimit-remaining']);

      expect(remaining1).toBeGreaterThan(remaining2);
      expect(remaining2).toBeGreaterThan(remaining3);
    });
  });

  describe('CORS Configuration', () => {
    test('should allow requests from allowed origins', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:3000');

      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });

    test('should allow requests from frontend port 3001', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:3001');

      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3001');
    });

    test('should include CORS headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers).toHaveProperty('access-control-allow-origin');
      expect(response.headers).toHaveProperty('access-control-allow-credentials');
    });

    test('should handle preflight OPTIONS requests', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type');

      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-methods']).toContain('POST');
      expect(response.headers['access-control-allow-headers']).toContain('Content-Type');
    });

    test('should allow all configured HTTP methods', async () => {
      const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
      
      for (const method of methods) {
        const response = await request(app)
          .options('/api/health')
          .set('Origin', 'http://localhost:3000')
          .set('Access-Control-Request-Method', method);

        expect(response.status).toBe(200);
        expect(response.headers['access-control-allow-methods']).toContain(method);
      }
    });
  });

  describe('Security Headers', () => {
    test('should include X-Frame-Options header', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.headers['x-frame-options']).toBe('DENY');
    });

    test('should prevent clickjacking attacks', async () => {
      const response = await request(app)
        .get('/');

      expect(response.headers['x-frame-options']).toBe('DENY');
    });
  });

  describe('JSON Parsing', () => {
    test('should parse JSON request bodies', async () => {
      const testData = { message: 'test data' };
      
      // Create a test route that echoes the request body
      app.post('/test-json', (req, res) => {
        res.json(req.body);
      });

      const response = await request(app)
        .post('/test-json')
        .send(testData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(testData);
    });

    test('should handle URL-encoded data', async () => {
      const testData = { message: 'test data' };
      
      // Create a test route that echoes the request body
      app.post('/test-urlencoded', (req, res) => {
        res.json(req.body);
      });

      const response = await request(app)
        .post('/test-urlencoded')
        .send(testData)
        .set('Content-Type', 'application/x-www-form-urlencoded');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(testData);
    });
  });

  describe('Health Endpoint', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('version', '1.0.0');
    });

    test('should return valid timestamp', async () => {
      const response = await request(app)
        .get('/api/health');

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });

    test('should return valid uptime', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.uptime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Root Endpoint', () => {
    test('should return server status message', async () => {
      const response = await request(app)
        .get('/');

      expect(response.status).toBe(200);
      expect(response.text).toBe('SWIFT PAYMENT SYSTEM - Backend Server is running');
    });
  });

  describe('Error Handling', () => {
    test('should handle 404 errors gracefully', async () => {
      const response = await request(app)
        .get('/nonexistent-route');

      expect(response.status).toBe(404);
    });

    test('should handle malformed JSON gracefully', async () => {
      app.post('/test-json', (req, res) => {
        res.json(req.body);
      });

      const response = await request(app)
        .post('/test-json')
        .send('invalid json')
        .set('Content-Type', 'application/json');

      // Express should handle this gracefully
      expect(response.status).toBe(400);
    });
  });

  describe('Performance', () => {
    test('should respond to health check quickly', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .get('/api/health');
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(response.status).toBe(200);
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });

    test('should handle concurrent requests', async () => {
      const requests = Array(10).fill().map(() => 
        request(app).get('/api/health')
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });
});
