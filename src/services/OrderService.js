import axios from "axios";

const URL = process.env.REACT_APP_BASE_URL;
const BASE_URL = URL + '/orders'


export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${BASE_URL}`, orderData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with ID ${orderId}:`, error);
    throw error;
  }
};

export const updateOrder = async (orderId, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${orderId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating order with ID ${orderId}:`, error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting order with ID ${orderId}:`, error);
    throw error;
  }
};

export const updateOrderVariantStatuses = async (orderId,updates) => {
  try {
    const response = await axios.put(`${URL}/order-variants/status-update/${orderId}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating status of order with ID ${orderId}:`, error);
    throw error;
  }
};

export const updateOrderVariants = async (orderId,updates) => {
  try {
    const response = await axios.put(`${URL}/order-variants/update/${orderId}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating variant of order with ID ${orderId}:`, error);
    throw error;
  }
};


export const updateOrderPaymentStatuses = async (orderId,updates) => {
  try {
    const response = await axios.put(`${URL}/payment/status-update/${orderId}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating status of order with ID ${orderId}:`, error);
    throw error;
  }
};


export const createVendorOrder= async (payload) => {
  try {
    const response = await axios.post(`${URL}/vendor-orders`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error Creating Vendor order :`, error);
    throw error;
  }
};


export const getVendorOrder= async () => {
  try {
    const response = await axios.get(`${URL}/vendor-orders`);
    return response.data;
  } catch (error) {
    console.error(`Error getting vendor orders :`, error);
    throw error;
  }
};


export const getVendorOrdersByVendorId= async (vendorId) => {
  try {
    const response = await axios.get(`${URL}/vendor-orders/vendor/${vendorId}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting vendor orders :`, error);
    throw error;
  }
};



export const fetchPaginatedOrders = async ({
  page,
  size,
  status,
  orderId,
  customerId,
  startDate,
  endDate,
}) => {
  try {
    const params = { page, size };

    if (status?.length > 0) params.status = status.join(',');
    if (orderId) params.orderId = orderId;
    if (customerId) params.customerId = customerId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await axios.get(`${BASE_URL}/paginated`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching paginated orders:', error);
    throw error;
  }
};




export const fetchOrderAnalytics = async ({ status, orderId, customerId, startDate, endDate }) => {
  try {
    const params = {};

    if (status?.length > 0) params.status = status.join(',');
    if (orderId) params.orderId = orderId;
    if (customerId) params.customerId = customerId;
    if (startDate) params.startDate = startDate.toISOString().split("T")[0];
    if (endDate) params.endDate = endDate.toISOString().split("T")[0];

    const response = await axios.get(`${BASE_URL}/analytics`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching order analytics:", error);
    return null;
  }
};



// services/vendorOrderService.js

export const fetchPaginatedVendorOrders = async ({ page, size, status, orderId, startDate, endDate }) => {
  try {
    const params = {
      page,
      size,
    };

    if (status && status.length > 0) {
      params.status = status.join(",");
    }

    if (orderId) {
      params.vendorOrderId = orderId;
    }

    if (startDate) {
      params.startDate = startDate.toISOString().split("T")[0];
    }

    if (endDate) {
      params.endDate = endDate.toISOString().split("T")[0];
    }

    const response = await axios.get(`${URL}/vendor-orders/paginated`, { params });
    return response.data; // expected to be an array of vendor orders
  } catch (error) {
    console.error("Error fetching paginated vendor orders:", error);
    return [];
  }
};


export const fetchVendorOrderAnalytics = async ({ status, orderId, startDate, endDate }) => {
  try {
    const params = {};

    if (status && status.length > 0) {
      params.status = status.join(",");
    }

    if (orderId) {
      params.orderId = orderId;
    }

    if (startDate) {
      params.startDate = startDate.toISOString().split("T")[0];
    }

    if (endDate) {
      params.endDate = endDate.toISOString().split("T")[0];
    }

    const response = await axios.get(`${URL}/vendor-orders/analytics`, { params });
    return response.data; // expected to include revenue, weight, quantity, etc.
  } catch (error) {
    console.error("Error fetching vendor order analytics:", error);
    return null;
  }
};


export const getCodOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${URL}/payment/cod/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with ID ${orderId}:`, error);
    throw error;
  }
};

export const sendCodOrderById = async (orderId, amountToCollect) => {
  try {
    const response = await axios.post(
      `${URL}/payment/cod/generate-link/${orderId}`,
      {}, 
      {
        params: { amountToCollect }, 
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error generating COD link for order ID ${orderId}:`, error);
    throw error;
  }
};

