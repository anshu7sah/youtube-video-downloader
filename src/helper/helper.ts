export const getAvailableVideoQuality = (formats: any) => {
  let result = [];

  for (let i = 0; i < formats.length; i++) {
    if (formats[i].qualityLabel !== null) {
      result.push(formats[i]);
    }
  }
  return [...new Set(result.map((m) => m.height))];
};
