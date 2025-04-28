
import { API_URL } from "@/context/AuthContext";

// Helper function to get the authentication token
const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Helper function to create headers with authentication
const createAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Token ${token}` } : {}),
  };
};

// API service functions
export const apiService = {
  // Tenant-related endpoints
  async fetchTenants() {
    const response = await fetch(`${API_URL}/tenants/`, {
      headers: createAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch tenants");
    }
    
    return response.json();
  },
  
  async addTenant(data: { full_name: string; house_number: string }) {
    const response = await fetch(`${API_URL}/tenants/add/`, {
      method: "POST",
      headers: createAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error("Failed to add tenant");
    }
    
    return response.json();
  },
  
  // Payment-related endpoints
  async fetchPayments() {
    const response = await fetch(`${API_URL}/payments/`, {
      headers: createAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch payments");
    }
    
    return response.json();
  },
  
  async createPaymentIssue(data: { title: string; amount: number; description: string }) {
    const response = await fetch(`${API_URL}/payment-issues/`, {
      method: "POST",
      headers: createAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error("Failed to create payment issue");
    }
    
    return response.json();
  },
  
  async createPayment(data: { 
    tenant: number; 
    payment_due_id: number; 
    amount: number; 
    category: string;
    issue: number;
    description: string;
    date: string;
  }) {
    const response = await fetch(`${API_URL}/create-payment/`, {
      method: "POST",
      headers: createAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to create payment");
    }
    
    return response.json();
  },
  
  // Expense-related endpoints
  async fetchExpenses() {
    const response = await fetch(`${API_URL}/list-expenses/`, {
      headers: createAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }
    
    return response.json();
  },
  
  async createExpense(data: { category: string; description: string; amount: number }) {
    const response = await fetch(`${API_URL}/create-expense/`, {
      method: "POST",
      headers: createAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error("Failed to create expense");
    }
    
    return response.json();
  },
  
  // Dashboard data
  async fetchMonthlySummary(month?: number, year?: number) {
    let url = `${API_URL}/monthly-summary/`;
    
    if (month && year) {
      url += `?month=${month}&year=${year}`;
    }
    
    const response = await fetch(url, {
      headers: createAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch monthly summary");
    }
    
    return response.json();
  },
  
  async fetchOutstandingPayments() {
    const response = await fetch(`${API_URL}/list-due-payment/`, {
      headers: createAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch outstanding payments");
    }
    
    return response.json();
  },
};
