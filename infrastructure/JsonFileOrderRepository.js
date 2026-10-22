import fs from 'node:fs';

export class JsonFileOrderRepository {
  constructor(fileUrl) {
    this.fileUrl = fileUrl;
  }

  all() {
    return JSON.parse(fs.readFileSync(this.fileUrl, 'utf8'));
  }
}
