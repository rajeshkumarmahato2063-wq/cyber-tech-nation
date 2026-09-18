/**
 * Production Data Export System (CSV / PDF)
 */

/**
 * Export array of JSON records as downloadable CSV file
 * @param {Array<Object>} data 
 * @param {string} filename 
 */
export const exportToCSV = (data = [], filename = 'zayathon_export.csv') => {
  if (!data || data.length === 0) {
    alert('No records available to export.');
    return;
  }

  // Extract CSV Headers
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  // Map Rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      const escaped = ('' + (val === null || val === undefined ? '' : val)).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
