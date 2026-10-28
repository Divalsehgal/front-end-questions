export class QueryBuilder {
  private fields: string[] = [];
  private conditions: string[] = [];
  private order = '';
  private max = 0;

  constructor(private table: string) {}

  // Every method returns `this`, which is what lets you chain the calls.
  select(...fields: string[]): this {
    this.fields = fields;
    return this;
  }

  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }

  orderBy(field: string, dir: 'ASC' | 'DESC' = 'ASC'): this {
    this.order = `${field} ${dir}`;
    return this;
  }

  limit(n: number): this {
    if (!Number.isInteger(n) || n <= 0) {
      throw new Error('limit must be a positive integer');
    }
    this.max = n;
    return this;
  }

  build(): string {
    const columns = this.fields.length > 0 ? this.fields.join(', ') : '*';
    let query = `SELECT ${columns} FROM ${this.table}`;
    if (this.conditions.length > 0) {
      query += ` WHERE ${this.conditions.join(' AND ')}`;
    }
    if (this.order) {
      query += ` ORDER BY ${this.order}`;
    }
    if (this.max) {
      query += ` LIMIT ${this.max}`;
    }
    return query;
  }
}
