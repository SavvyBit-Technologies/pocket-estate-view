
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
    try {
      const response = await fetch(`${API_URL}/tenants/`, {
        headers: createAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to fetch tenants (Status: ${response.status})`);
      }
      
      return response.json();
    } catch (error) {
      console.error("API Error in fetchTenants:", error);
      throw error;
    }
  },
  
  async addTenant(data: { full_name: string; house_number: string }) {
    try {
      const response = await fetch(`${API_URL}/tenants/add/`, {
        method: "POST",
        headers: createAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to add tenant (Status: ${response.status})`);
      }
      
      return response.json();
    } catch (error) {
      console.error("API Error in addTenant:", error);
      throw error;
    }
  },
  
  // Payment-related endpoints
  async fetchPayments() {
    try {
      const response = await fetch(`${API_URL}/payments/`, {
        headers: createAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to fetch payments (Status: ${response.status})`);
      }
      
      return response.json();
    } catch (error) {
      console.error("API Error in fetchPayments:", error);
      throw error;
    }
  },
  
  async createPaymentIssue(data: { title: string; amount: number; description: string }) {
    try {
      const response = await fetch(`${API_URL}/payment-issues/`, {
        method: "POST",
        headers: createAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to create payment issue (Status: ${response.status})`);
      }
      
      return response.json();
    } catch (error) {
      console.error("API Error in createPaymentIssue:", error);
      throw error;
    }
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
    try {
      const response = await fetch(`${API_URL}/create-payment/`, {
        method: "POST",
        headers: createAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to create payment (Status: ${response.status})`);
      }
      
      return response.json();
    } catch (error) {
      console.error("API Error in createPayment:", error);
      throw error;
    }
  },
  
  // Expense-related endpoints
  async fetchExpenses() {
    try {
      const response = await fetch(`${API_URL}/list-expenses/`, {
        headers: createAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to fetch expenses (Status: ${response.status})`);
      }
      
      return response.json();
    } catch (error) {
      console.error("API Error in fetchExpenses:", error);
      throw error;
    }
  },
  
  async createExpense(data: { category: string; description: string; amount: number }) {
    try {
      const response = await fetch(`${API_URL}/create-expense/`, {
        method: "POST",
        headers: createAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to create expense (Status: ${response.status})`);
      }
      
      return response.json();
    } catch (error) {
      console.error("API Error in createExpense:", error);
      throw error;
    }
  },
  
  // Dashboard data
  async fetchMonthlySummary(month?: number, year?: number) {
    try {
      let url = `${API_URL}/monthly-summary/`;
      
      if (month && year) {
        url += `?month=${month}&year=${year}`;
      }
      
      const response = await fetch(url, {
        headers: createAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to fetch monthly summary (Status: ${response.status})`);
      }
      
      return response.json();
    } catch (error) {
      console.error("API Error in fetchMonthlySummary:", error);
      throw error;
    }
  },
  
  async fetchOutstandingPayments() {
    try {
      const response = await fetch(`${API_URL}/list-due-payment/`, {
        headers: createAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to fetch outstanding payments (Status: ${response.status})`);
      }
      
      return response.json();
    } catch (error) {
      console.error("API Error in fetchOutstandingPayments:", error);
      throw error;
    }
  },
  
  async fetchPaymentIssues() {
    try {
      const response = await fetch(`${API_URL}/list-issues/`, {
        headers: createAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to fetch payment issues (Status: ${response.status})`);
      }
      
      return response.json();
    } catch (error) {
      console.error("API Error in fetchPaymentIssues:", error);
      throw error;
    }
  },
  
  // New function to resolve payment issues
  async resolvePaymentIssue(issueId: number) {
    try {
      const response = await fetch(`${API_URL}/resolve-issue/${issueId}/`, {
        method: "PATCH",
        headers: createAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to resolve payment issue (Status: ${response.status})`);
      }
      
      return response.json();
    } catch (error) {
      console.error("API Error in resolvePaymentIssue:", error);
      throw error;
    }
  },
  
  // Auth related endpoints
  async requestPasswordResetOTP(email: string) {
    try {
      const response = await fetch(`${API_URL}/request-password-reset-otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to request password reset (Status: ${response.status})`);
      }
      
      return response.json();
    } catch (error) {
      console.error("API Error in requestPasswordResetOTP:", error);
      throw error;
    }
  },
  
  async changePassword(data: { email: string; otp: string; new_password: string }) {
    try {
      const response = await fetch(`${API_URL}/change-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to change password (Status: ${response.status})`);
      }
      
      return response.json();
    } catch (error) {
      console.error("API Error in changePassword:", error);
      throw error;
    }
  },
};
