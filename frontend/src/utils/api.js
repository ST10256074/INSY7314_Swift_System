// Use HTTP for development to avoid HTTPS certificate issues
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://localhost:8443' 
  : 'http://localhost:8080';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Helper method to get headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Helper method to handle responses
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || `HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  }

  // Set auth token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // User authentication
  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/user/signup`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify(userData),
        mode: 'cors',
        credentials: 'include'
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/user/login`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify(credentials),
        mode: 'cors',
        credentials: 'include'
      });
      
      const data = await this.handleResponse(response);
      
      // Store the token if login successful
      if (data.token) {
        this.setToken(data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  // Logout - clear all authentication data
  logout() {
    this.setToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    // Clear any other user-related data
    localStorage.removeItem('userPreferences');
    localStorage.removeItem('lastLoginTime');
  }

  // Get current user profile
  async getUserProfile() {
    try {
      const response = await fetch(`${this.baseURL}/user/profile`, {
        method: 'GET',
        headers: this.getHeaders(true),
        mode: 'cors',
        credentials: 'include'
      });
      
      const data = await this.handleResponse(response);

      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  // Payment methods
  async submitPayment(paymentData) {
    try {
      const response = await fetch(`${this.baseURL}/payments/submit`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(paymentData),
        mode: 'cors',
        credentials: 'include'
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Payment submission error:', error);
      throw error;
    }
  }

  async getAllPayments() {
    try {
      const response = await fetch(`${this.baseURL}/payments/all`, {
        method: 'GET',
        headers: this.getHeaders(true),
        mode: 'cors',
        credentials: 'include'
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get all payments error:', error);
      throw error;
    }
  }

  async getMyPayments() {
    try {
      const response = await fetch(`${this.baseURL}/payments/my-applications`, {
        method: 'GET',
        headers: this.getHeaders(true),
        mode: 'cors',
        credentials: 'include'
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get my payments error:', error);
      throw error;
    }
  }

  async getPaymentById(paymentId) {
    try {
      const response = await fetch(`${this.baseURL}/payments/${paymentId}`, {
        method: 'GET',
        headers: this.getHeaders(true),
        mode: 'cors',
        credentials: 'include'
      });
      
      const data = await this.handleResponse(response);
      
      // Return the full response data - the frontend will handle extracting the application
      return data;
    } catch (error) {
      console.error('Get payment by ID error:', error);
      throw error;
    }
  }

  async reviewPayment(paymentId, reviewData) {
    try {
      const response = await fetch(`${this.baseURL}/payments/review/${paymentId}`, {
        method: 'PATCH',
        headers: this.getHeaders(true),
        body: JSON.stringify(reviewData),
        mode: 'cors',
        credentials: 'include'
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Payment review error:', error);
      throw error;
    }
  }

  async getPaymentsByStatus(status) {
    try {
      const response = await fetch(`${this.baseURL}/payments/status/${status}`, {
        method: 'GET',
        headers: this.getHeaders(true),
        mode: 'cors',
        credentials: 'include'
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get payments by status error:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;