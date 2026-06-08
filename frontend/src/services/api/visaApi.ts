import apiClient from './client';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface VisaRequirementsResponse {
  country: string;
  message?: string;
  financialRequirements?: {
    minimumBankBalanceBDT?: string;
    maintenancePeriodMonths?: string | number;
  };
}

export interface VisaFinancialGuideResponse {
  country: string;
  currency: string;
  estimatedAnnualTuitionBDT: number;
  estimatedAnnualLivingBDT: number;
  minimumBankBalanceRequiredBDT: string | number;
  maintenancePeriodMonths: number | string;
  allowedSponsors: string[];
  documentsRequired: string[];
}

export const visaApi = {
  getRequirements: async (countryCode: string) => {
    const res = await apiClient.get<ApiResponse<VisaRequirementsResponse>>(`/visa/${countryCode}`);
    return res.data.data;
  },
  getFinancialGuide: async (countryCode: string) => {
    const res = await apiClient.get<ApiResponse<VisaFinancialGuideResponse>>(`/visa/financial/${countryCode}`);
    return res.data.data;
  },
};
