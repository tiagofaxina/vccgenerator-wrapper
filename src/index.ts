import { html2json } from './utils/html2json';
import { json2json } from './utils/json2json';
import { BankResonseData, fetchBanks, getBanksFromData } from './services/fetch-banks';
import { BinResonseData, fetchBins, getBinsFromData } from './services/fetch-bins';

const COUNTRY = 'Brazil';
const BRAND = 'AMERICAN EXPRESS COMPANY';

type FetchBanksparams = {
  country: string;
  brand: string;
};

type FetchBinsparams = {
  country: string;
  brand: string;
  bank: string;
};

const getBanks = async ({ country, brand }: FetchBanksparams): Promise<string[]> => {
  try {
    const response = await fetchBanks({
      country,
      brand,
    });
    const data = response.data;
    let json;

    const content_type = response.headers['content-type'];
    if (content_type.includes('json')) {
      json = await json2json(data);
    } else if (content_type.includes('html')) {
      json = await html2json(data);
    } else {
      throw new Error(`Não sei como fazer aqui não content type ${content_type}`);
    }

    return getBanksFromData(json as BankResonseData[]);
  } catch (error) {
    throw error;
  }
};

const getBins = async ({ country, brand, bank }: FetchBinsparams): Promise<string[]> => {
  try {
    const response = await fetchBins({
      country,
      brand,
      bank,
    });
    const data = response.data;
    let json;

    const content_type = response.headers['content-type'];
    if (content_type.includes('json')) {
      json = await json2json(data);
    } else if (content_type.includes('html')) {
      json = await html2json(data);
    } else {
      throw new Error(`Não sei como fazer aqui não content type ${content_type}`);
    }

    return getBinsFromData(json as BinResonseData[]);
  } catch (error) {
    throw error;
  }
};

(async () => {
  try {
    const banks = await getBanks({ country: COUNTRY, brand: BRAND });
    console.log(banks);

    // const bins = await getBins({ country: COUNTRY, brand: BRAND, bank: banks[0] });
    const promises = banks.map(bank => getBins({ country: COUNTRY, brand: BRAND, bank }));
    const binsArray = await Promise.all(promises);
    const bins = binsArray.reduce(function (arr, row) {
      return arr.concat(row);
    }, []);
    console.log(bins);
  } catch (error) {
    console.log(error);
  }
})();
