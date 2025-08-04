import request from 'supertest';
import app from '../app';

describe('API Endpoints', () => {
  describe('GET /api', () => {
    it('should return API documentation', async () => {
      const response = await request(app).get('/api');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.endpoints).toHaveProperty('teams');
      expect(response.body.endpoints).toHaveProperty('courts');
      expect(response.body.endpoints).toHaveProperty('queues');
    });
  });

  describe('GET /api/teams', () => {
    it('should return teams list', async () => {
      const response = await request(app).get('/api/teams');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/courts', () => {
    it('should return courts list', async () => {
      const response = await request(app).get('/api/courts');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/queues/general', () => {
    it('should return general queue', async () => {
      const response = await request(app).get('/api/queues/general');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
}); 