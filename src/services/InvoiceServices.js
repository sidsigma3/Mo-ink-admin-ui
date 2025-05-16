import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const downloadInvoice = async (orderId) => {
    try {
      const response = await axios.get(`${BASE_URL}/invoice/download/${orderId}`, {
        responseType: 'blob', // Handle binary PDF
      });
  
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
  
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || "Failed to download invoice.",
      };
    }
  };
  

export const generateInvoice = async (orderId) => {
  try {
    const response = await axios.get(`${BASE_URL}/invoice/${orderId}`);
    return { success: true, message: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || "Failed to generate invoice.",
    };
  }
};


export const emailInvoice = async (orderId) => {
  try {
    const response = await axios.get(`${BASE_URL}/invoice/email/${orderId}`);
    return { success: true, message: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || "Failed to email invoice.",
    };
  }
};


export const emailCreditReceipt = async (orderId, type) => {
  try {
    const response = await axios.get(`${BASE_URL}/credit-receipt/email/${orderId}/${type}`);
    return { success: true, message: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || "Failed to email credit receipt.",
    };
  }
};


export const downloadCreditReceipt = async (orderId, type) => {
  try {
    const response = await axios.get(`${BASE_URL}/credit-receipt/download/${orderId}/${type}`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `credit_receipt_${orderId}_${type}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || "Failed to download credit receipt.",
    };
  }
};


export const downloadVendorInvoice = async (orderId) => {
  try {
    const response = await axios.get(`${BASE_URL}/purchase-order/download/${orderId}`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vendor_invoice_${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || "Failed to download credit receipt.",
    };
  }
};