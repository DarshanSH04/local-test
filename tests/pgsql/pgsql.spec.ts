import { knex } from 'knex';
import { promises as fs } from 'fs';
import * as path from 'path';
import {assert} from 'chai'

// Database connection
const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'local_db'
  }
})

// Helper function to read and execute SQL files
async function executeSQLFile(filename: string) {
  const filePath = path.join(__dirname, '..', '..', 'src', 'schemas', filename)
  const sql = await fs.readFile(filePath, 'utf8')
  return db.raw(sql)
}

describe('pgsql', () => {
  // Before all tests, create tables and test data
  before(async () => {
    try {
      // Create tables
      await executeSQLFile('entity.sql')
      await executeSQLFile('green_company.sql')

      // Create test data
      const [entity] = await db('entity').insert({
        id: 1,
        name: 'test',
        updated_at: new Date().toISOString()
      }).returning('id')

      await db('green_company').insert({
        id: 1,
        entity_id: entity.id,
        name: 'Test Green Company',
        normalized_name: 'test_green_company',
        source_url: 'https://example.com',
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Setup failed:', error)
      throw error
    }
  })

  // After all tests, clean up
  after(async () => {
    try {
      // Delete data
      await db('green_company').del()
      await db('entity').del()
      // Drop tables in correct order (due to foreign key constraints)
      await db.schema.dropTableIfExists('green_company')
      await db.schema.dropTableIfExists('entity')

      // Close connection
      await db.destroy()
    } catch (error) {
      console.error('Cleanup failed:', error)
      throw error
    }
  });

  it('should create and verify database records', async () => {
    const companies = await db('green_company').select('*')
    console.log(companies)
    assert.equal(companies.length, 1)
    assert.equal(companies[0].name, 'Test Green Company')

    const entities = await db('entity').select('*')
    assert.equal(entities.length, 1)
    assert.equal(entities[0].name, 'test')
  })
})
