import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from './axiosInstance';


type FetchFunction<T, Args extends any[]> = (...args: Args) => Promise<T>;

function useFetchData<T, Args extends any[]>(
  fetchFunction: FetchFunction<T, Args>,
  ...args: Args
) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchFunction(...args);
        setData(result);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction, ...args]);

  return { data, isLoading, error };
}
export default useFetchData;

export const getUserById = async (id: any, token: any): Promise<any> => {
  const response = await axios.get(`https://gomisteria-api.onrender.com/api/users/${id}`, {
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  });
  return response?.data ?? null;
};

export const getProData = async (
  rowsPerPage: number,
  pageNumber: number,
  filters: Record<string, string | string[]> = {}
): Promise<{ data: any[]; meta: any }> => {
  try {
    // Base params
    const params: Record<string, any> = { rowsPerPage, pageNumber };

    // NEVER mutate the incoming filters
    const { category, ...rest } = filters || {};

    // Map 'category' -> 'extra2' (backend expects this)
    if (category) {
      params.extra2 = Array.isArray(category) ? category[0] : category; // ensure string
    }

    // Merge the remaining filters (as-is)
    Object.assign(params, rest);

    const response = await axios.get("https://gomisteria-api.onrender.com/api/prodata/items", { params });

    return {
      data: response.data?.data || [],
      meta: response.data?.meta || {
        currentPage: pageNumber,
        itemsPerPage: rowsPerPage,
        totalItems: 0,
        totalPages: 0,
      },
    };
  } catch (error) {
    console.error("Error fetching ProData:", error);
    return {
      data: [],
      meta: {
        currentPage: pageNumber,
        itemsPerPage: rowsPerPage,
        totalItems: 0,
        totalPages: 0,
      },
    };
  }
};


export const getProDataById = async (id: string): Promise<any> => {
  try {
    const response = await axios.get("https://gomisteria-api.onrender.com/api/prodata/items", {
      params: {
        itemCode: id,
        rowsPerPage: 1,
        pageNumber: 1,
      },
    });
    const result = response?.data;
    if (!Array.isArray(result) || result.length === 0) {
      return null;
    }
    return result[0];
  } catch (error) {
    console.error("Error fetching item by ID:", error);
    return null;
  }
};
export const fetchProDataFiltersByCategory = async (category: string, filters?: Record<string, string | string[]>) => {
  const response = await axios.get("https://gomisteria-api.onrender.com/api/prodata/filters", {
    params: { category, ...filters },
  });
  return response.data;
};
export const searchProducts = async (query: string) => {
  const response = await axios.get("https://gomisteria-api.onrender.com/api/prodata/search", {
    params: { q: query },
  });
  return response.data;
};



export const getProducts = async (page?: number, limit?: number, query?: string): Promise<any> => {
  const response = await axiosInstance.get(`/products?page=${page}&limit=${limit}${query ? `&${query}` : ''}`);
  return response?.data ?? null;
};

export const getSearchProducts = async (query?: string): Promise<any> => {
  const response = await axiosInstance.get(`/products?page=1&limit=10${query ? `&${query}` : ''}`);
  return response?.data ?? null;
};

export const getProductsByCategory = async (category: string, page?: number, limit?: number): Promise<any> => {
  const response = await axiosInstance.get(`/products?page=${page}&limit=${limit}&category=${category}`);
  return response?.data ?? null;
};

export const getProductsById = async (id: any): Promise<any> => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response?.data ?? null;
};

export const getOrdersByUserId = async (id: any, page?: number, limit?: number, sort?: string, order?: 'asc' | 'desc'): Promise<any> => {
  const params = new URLSearchParams();
  if (page !== undefined) params.append('page', String(page));
  if (limit !== undefined) params.append('limit', String(limit));
  if (sort) params.append('sort', sort);
  if (order) params.append('order', order);
  const response = await axiosInstance.get(`/orders/user/${id}?${params.toString()}`);
  return response?.data ?? null;
};

export const getOrderById = async (id: any): Promise<any> => {
  const response = await axiosInstance.get(`/orders/${id}`);
  return response?.data ?? null;
};

export const getRoadAssistance = async (query?: string): Promise<any> => {
  const response = await axiosInstance.get(`/users/businesses/filter?type=${query}`);
  return response?.data ?? null;
};

export const getServices = async (): Promise<any> => {
  const response = await axiosInstance.get(`/services`);
  return response?.data ?? null;
};

export const getPreordersByUserId = async (id: any, page?: number, limit?: number, sort?: string, order?: 'asc' | 'desc'): Promise<any> => {
  const response = await axiosInstance.get(`/ngarkesa/preorders/user/${id}?page=${page}&limit=${limit}&sort=${sort}&order=${order}`);
  return response?.data ?? null;
};

export const getPreorderById = async (id: any): Promise<any> => {
  const response = await axiosInstance.get(`/ngarkesa/preorders/detail/${id}`);
  return response?.data ?? null;
};

export const getNgarkesas = async (page?: number, limit?: number, sort?: string, order?: 'asc' | 'desc'): Promise<any> => {
  const response = await axiosInstance.get(`/ngarkesa?page=${page}&limit=${limit}&sort=${sort}&order=${order}`);
  return response?.data ?? null;
};

export const getNgarkesaById = async (id: any): Promise<any> => {
  const response = await axiosInstance.get(`/ngarkesa/${id}`);
  return response?.data ?? null;
};

export const getDiscounts = async (): Promise<any> => {
  const response = await axiosInstance.get(`/discount`);
  return response?.data ?? null;
};
export const getCoupon = async (code: string): Promise<any> => {
  const response = await axiosInstance.get(`/coupons/${code}`);
  return response?.data ?? null;
};
export const updateCoupon = async (): Promise<any> => {
  const response = await axiosInstance.get(`/couponb`);
  return response?.data ?? null;
};
export const getHomepageCms = async (): Promise<any> => {
  const response = await axiosInstance.get(`/homepage`);
  return response?.data ?? null;
};