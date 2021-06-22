import { html2json } from './utils/html2json';
import { json2json } from './utils/json2json';
import { BankResonseData, fetchBanks, getBanksFromData } from './services/fetch-banks';
import { BinResonseData, fetchBins, getBinsFromData } from './services/fetch-bins';
import { acceptedBrands, binRegex } from './config/brands';

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
    //@ts-ignore
    const brand = process.argv.find(arg => arg.includes('brand')).split('=')[1] || 'DEFAULT';

    //@ts-ignore
    const brandsToFetch = acceptedBrands[brand.toUpperCase()];

    const banksPromise = brandsToFetch.map((brandToFetch: string) =>
      getBanks({ country: COUNTRY, brand: brandToFetch }),
    );
    const banksArray = await Promise.all(banksPromise);
    const banksConcatenated = banksArray.reduce(function (arr, row) {
      //@ts-ignore
      return arr.concat(row);
    }, []) as string[];

    const banks = [...new Set(banksConcatenated)];

    const promises = banks.map(bank => getBins({ country: COUNTRY, brand, bank }));
    const binsArray = await Promise.all(promises);
    const binsConcatenated = binsArray.reduce(function (arr, row) {
      //@ts-ignore
      return arr.concat(row);
    }, []);

    const bins = [...new Set(binsConcatenated)];

    //@ts-ignore
    const brandBinRegex = binRegex[brand.toUpperCase()];
    const brandBinsMatched: string[] = [];
    const brandBinsNotMatched: string[] = [];

    bins.map(bin => {
      console.log(brandBinRegex.test(String(bin)));
      if (brandBinRegex.test(String(bin))) {
        brandBinsMatched.push(bin);
      } else {
        brandBinsNotMatched.push(bin);
      }
    });

    console.log('---------------------------------------------------------');
    console.log('BANDEIRA: ', brand.toUpperCase());
    console.log('QTD. BANCOS: ', banks.length);
    console.log('BANCOS: ');
    console.log(banks);
    console.log('QTD. BINS: ', bins.length);
    console.log('BINS: ');
    console.log(bins);
    console.log('QTD. BINS RECONHECIDOS: ', brandBinsMatched.length);
    console.log('BINS RECONHECIDOS: ');
    console.log(brandBinsMatched);

    if (bins.length === brandBinsMatched.length) {
      console.log('TODOS OS BINS FORAM RECONHECIDOS');
    } else {
      console.log('ALGUNS BINS NÃO FORAM RECONHECIDOS');
    }
  } catch (error) {
    console.log(error);
  }
})();
