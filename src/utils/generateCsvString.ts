export const generateCsvString = (csvData: Record<string, any>[]): string => {
  if (csvData.length === 0) {
    return '';
  }

  const headers = Object.keys(csvData[0]);

  const csvHeaders = `"${headers.join('","')}"`;

  const csvRows = csvData.map((row) => {
    const values = Object.values(row);

    return `"${values.join('","')}"`;
  });

  const csvString = [csvHeaders, ...csvRows].join('\n');

  return csvString;
};
