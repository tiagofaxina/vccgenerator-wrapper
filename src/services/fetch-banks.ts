import qs from 'qs';
import { vccApi } from './vcc-api';

type FetchBanksparams = {
  country: string;
  brand: string;
};

export type BankResonseData = {
  issuer: string;
};

export const getBanksFromData = (responseData: BankResonseData[]): string[] => {
  return responseData.map(bank => bank.issuer);
};

export const fetchBanks = ({ country, brand }: FetchBanksparams) =>
  vccApi.post(
    '/',
    qs.stringify({
      country,
      brand,
    }),
  );
