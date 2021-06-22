import { html2json } from './utils/html2json';
import { json2json } from './utils/json2json';
import { BankResonseData, fetchBanks, getBanksFromData } from './services/fetch-banks';
import { BinResonseData, fetchBins, getBinsFromData } from './services/fetch-bins';
import { acceptedBrands } from './config/brands';

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
    // console.log(response);

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

    let allBanks: string[] = [];
    let allBins: string[] = [];

    await Promise.all(
      brandsToFetch.map(async (brandToFetch: string) => {
        try {
          const banks = await getBanks({ country: COUNTRY, brand: brandToFetch });

          allBanks = [...allBanks, ...banks];

          const binsPromises = banks.map(bank => getBins({ country: COUNTRY, brand: brandToFetch, bank }));
          const binsArray = await Promise.all(binsPromises);

          const binsConcatenated = binsArray.reduce(function (arr, row) {
            //@ts-ignore
            return arr.concat(row);
          }, []) as string[];

          allBins = [...allBins, ...binsConcatenated];
          return allBins;
        } catch (error) {
          console.log(error);
        }
      }),
    );

    const banks = [...new Set(allBanks)];
    const bins = [...new Set(allBins)];

    console.log('---------------------------------------------------------');
    console.log('BANDEIRA: ', brand.toUpperCase());
    console.log('BANDEIRAS: ', brandsToFetch);
    console.log('QTD. BANCOS: ', banks.length);
    console.log('BANCOS: ');
    console.log(banks);
    console.log('QTD. BINS: ', bins.length);
    console.log('BINS: ');
    console.log(bins);
  } catch (error) {
    console.log(error);
  }
})();
