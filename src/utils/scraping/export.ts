import { ScrapedData, ExportFormat } from './types';
import { toast } from 'sonner';

export const exportData = (data: ScrapedData, format: ExportFormat): string => {
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);
    
    case 'csv': {
      const headers = Object.keys(data.elements[0] || {});
      const rows = data.elements.map(el => 
        headers.map(header => {
          const value = el[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"`
            : value;
        }).join(',')
      );
      return [headers.join(','), ...rows].join('\n');
    }
    
    case 'xml': {
      const metadata = `
        <metadata>
          <timestamp>${data.timestamp}</timestamp>
          <url>${data.url}</url>
          <total_elements>${data.elements.length}</total_elements>
        </metadata>
      `;
      
      const elements = data.elements.map(el => 
        `<element>${
          Object.entries(el)
            .map(([key, value]) => `<${key}>${value}</${key}>`)
            .join('')
        }</element>`
      ).join('\n');
      
      return `<?xml version="1.0" encoding="UTF-8"?>
<data>
  ${metadata}
  <elements>
    ${elements}
  </elements>
</data>`;
    }
    
    default:
      throw new Error('Unsupported format');
  }
};

export const downloadData = (data: string, filename: string): void => {
  const blob = new Blob([data], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success(`Downloaded ${filename}`);
};