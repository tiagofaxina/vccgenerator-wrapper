import qs from 'qs';
import { vccApi } from './vcc-api';

type FetchBinsparams = {
  country: string;
  brand: string;
  bank: string;
};

export type BinResonseData = {
  bin: string;
};

export const getBinsFromData = (responseData: BinResonseData[]): string[] => {
  return responseData.map(bin => bin.bin);
};

export const fetchBins = ({ country, brand, bank }: FetchBinsparams) =>
  vccApi.post(
    '/',
    qs.stringify({
      country,
      brand,
      bank,
    }),
  );
