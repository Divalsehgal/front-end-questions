/**
 * Builder pattern: build a SQL-ish string step by step with a fluent API.
 *   new QueryBuilder('users').select('id', 'name').where('age > 18').where("country = 'IN'").orderBy('name').limit(10).build()
 *   → "SELECT id, name FROM users WHERE age > 18 AND country = 'IN' ORDER BY name ASC LIMIT 10"
 * - select() with no args (or never called) means SELECT *
 * - orderBy(field, dir = 'ASC'); limit must be a positive integer (throw otherwise)
 * - each method returns `this`; build() can be called repeatedly
 */
export class QueryBuilder {
  constructor(table: string) {
    // your code
  }
  select(...fields: string[]): this {
    // your code
  }
  where(condition: string): this {
    // your code
  }
  orderBy(field: string, dir: 'ASC' | 'DESC' = 'ASC'): this {
    // your code
  }
  limit(n: number): this {
    // your code
  }
  build(): string {
    // your code
  }
}
