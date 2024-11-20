import { Client } from '@opensearch-project/opensearch';
import { assert } from 'chai';

const TEST_INDEX = 'entity_v2_test';
const client = new Client({
  node: 'https://localhost:9200',
  ssl: { rejectUnauthorized: false },
  auth: { username: 'admin', password: 'Password1!rohu656UHhhh' }
});

describe('OpenSearch', () => {
  before(async () => {
    // Create test index
    try {
      await client.indices.create({
        index: TEST_INDEX,
        body: {
          mappings: {
            properties: {
              name: { type: 'text' },
              created_at: { type: 'date' }
            }
          }
        }
      });
    } catch (error) {
      console.error('Setup failed:', error);
      throw error;
    }
  });

  after(async () => {
    try {
      await client.indices.delete({
        index: TEST_INDEX
      });
    } catch (error) {
      console.error('Cleanup failed:', error);
      throw error;
    }
  });

  it('should index and search documents', async () => {
    // Index a document
    await client.index({
      index: TEST_INDEX,
      body: {
        name: 'Test Entity',
        created_at: new Date().toISOString()
      },
      refresh: true
    });

    // Search for the document
    const response = await client.search({
      index: TEST_INDEX,
      body: {
        query: {
          match: {
            name: 'Test Entity'
          }
        }
      }
    });
    console.log(response)
    assert.equal(response.body.hits.total.value, 1);
    assert.equal(response.body.hits.hits[0]._source.name, 'Test Entity');
  });
});