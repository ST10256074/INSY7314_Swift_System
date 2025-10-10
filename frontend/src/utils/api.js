// Use HTTP for development to avoid HTTPS certificate issues
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://localhost:8443' 
  : 'http://localhost:8080';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  /**
   * Constructs HTTP headers for API requests
   * @param {boolean} includeAuth - Whether to include authorization token
   * @returns {Object} Headers object with Content-Type and optional Authorization
   */
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Processes HTTP responses and handles errors
   * @param {Response} response - Fetch API response object
   * @returns {Object|string} Parsed JSON data or text content
   * @throws {Error} Throws error for non-OK status codes
   */
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

  /**
   * Sets or clears the authentication token
   * @param {string|null} token - JWT token for authentication or null to clear
   */
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  /**
   * Registers a new user account
   * @param {Object} userData - User registration data (username, full_name, accountNumber, IDNumber, password)
   * @returns {Promise<Object>} Registration response from server
   */
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

  /**
   * Authenticates user login and stores JWT token
   * @param {Object} credentials - Login credentials (name, accountNumber, password)
   * @returns {Promise<Object>} Login response with user data and token
   */
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

  /**
   * Logs out user by clearing all stored authentication data
   */
  logout() {
    this.setToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    // Clear any other user-related data
    localStorage.removeItem('userPreferences');
    localStorage.removeItem('lastLoginTime');
  }

  /**
   * Retrieves the current authenticated user's profile information
   * @returns {Promise<Object>} User profile data including decrypted sensitive information
   */
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

  /**
   * Submits a new international payment application
   * @param {Object} paymentData - Payment details (recipientName, accountNumber, swiftCode, amount, currency, paymentProvider)
   * @returns {Promise<Object>} Payment submission response with application ID
   */
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

  /**
   * Retrieves all payment applications (employee access only)
   * @returns {Promise<Object>} All payment applications with decrypted data
   */
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

  /**
   * Retrieves payment applications submitted by the current user
   * @returns {Promise<Object>} User's payment applications with decrypted data
   */
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

  /**
   * Retrieves a specific payment application by its ID
   * @param {string} paymentId - MongoDB ObjectId of the payment application
   * @returns {Promise<Object>} Payment application details with decrypted data
   */
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

  /**
   * Reviews a payment application (approve/reject) - employee only
   * @param {string} paymentId - MongoDB ObjectId of the payment application
   * @param {Object} reviewData - Review decision (status, comments)
   * @returns {Promise<Object>} Updated payment application after review
   */
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

  /**
   * Retrieves payment applications filtered by their status
   * @param {string} status - Payment status ('pending', 'approved', 'rejected')
   * @returns {Promise<Object>} Payment applications matching the specified status
   */
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