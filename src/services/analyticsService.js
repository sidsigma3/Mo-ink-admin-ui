import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL + '/analytics';


export const fetchDashboardAnalytics = async (startDate, endDate) => {
  try {
    const hasDate = startDate && endDate;

    const response = await axios.get(`${BASE_URL}/dashboard`, {
      params: hasDate
        ? {
            startDate, // already a string like "2025-07-01"
            endDate,
          }
        : {},
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return null;
  }
};
