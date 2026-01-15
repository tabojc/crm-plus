
import XLSX from 'xlsx';
import path from 'path';

const filePath = path.join(process.cwd(), 'docs', 'PRECIOS ENE 2026.xls');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON to see structure
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).slice(0, 5); // First 5 rows

console.log(`Sheet Name: ${sheetName}`);
console.log('--- Top 5 Rows ---');
console.log(JSON.stringify(data, null, 2));
