export const json2json = async (result: any) => {
  return new Promise((resolve, reject) => {
    resolve(result.data);
  });
};
