import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class ReportService {
  async generateCsv(data: any[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Report');
    
    // Auto-generate headers based on keys of the first object
    if (data.length > 0) {
      sheet.columns = Object.keys(data[0]).map(key => ({ header: key, key }));
      sheet.addRows(data);
    }
    
    return await workbook.xlsx.writeBuffer() as unknown as Buffer;
  }

  async generatePdf(data: any[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: any[] = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      doc.text('MERGE Platform Report');
      doc.moveDown();
      doc.text(JSON.stringify(data, null, 2));
      doc.end();
    });
  }
}
