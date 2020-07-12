import path from 'path';
import fs from 'fs';
import csvParse from 'csv-parse';

class LoadCSVService {
  async execute(fileName: string): Promise<any[]> {
    const csvPath = path.resolve(__dirname, '..', '..', 'tmp', fileName);

    const readCSVStream = fs.createReadStream(csvPath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: any[] = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    return lines;
  }
}

export default LoadCSVService;
