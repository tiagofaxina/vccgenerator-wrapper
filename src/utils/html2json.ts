import cheerio from 'cheerio';

export const html2json = async (result: any) => {
  return new Promise((resolve, reject) => {
    try {
      const $ = cheerio.load(result.data);
      const json = {};
      $('[id]').each((i, el) => {
        const $el = $(el);
        // @ts-ignore
        json[$el.attr('id')] = getValue($el);
      });
      resolve(json);
    } catch (error) {
      reject(error);
    }
  });
};
