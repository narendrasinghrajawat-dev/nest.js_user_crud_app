import { Injectable, OnModuleInit } from '@nestjs/common';
import { Database } from 'arangojs';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: Database;

  constructor() {
    this.db = new Database({
      url: process.env.ARANGO_URL || 'http://localhost:8529',
      databaseName: process.env.ARANGO_DB || 'myapp',
      auth: {
        username: process.env.ARANGO_USERNAME || 'root',
        password: process.env.ARANGO_PASSWORD || '',
      },
    });
  }

  async onModuleInit() {
    try {
      // Test connection
      await this.db.version();
      console.log('Connected to ArangoDB successfully');
    } catch (error) {
      console.error('Failed to connect to ArangoDB:', error);
    }
  }

  getDatabase(): Database { 
    return this.db;
  }

  getCollection(collectionName: string) {
    return this.db.collection(collectionName);
  }
}