import { DB } from './types' // this is the Database interface we defined earlier
import { createPool } from 'mysql2' // do not use 'mysql2/promises'!
import { createPool as createPoolPromise} from 'mysql2/promise' // do not use 'mysql2/promises'!
import { Kysely, MysqlDialect } from 'kysely'
import { logger } from '../logging'

const dialect = new MysqlDialect({
  pool: createPool({
    database: 'kitabuatevent',
    host: 'localhost',
    user: 'root',
    password: 'admin',
    port: 3306,
    connectionLimit: 10,
  })
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely 
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how 
// to communicate with your database.
const db = new Kysely<DB>({
  dialect,
  log(event) {

    if (event.level === 'query') {
      logger.info(event.level)
      logger.info(event.query.sql)
      logger.info(event.queryDurationMillis)
    }

    if (event.level === "error") {
      logger.error(event.level)
      logger.error(event.error)
      logger.error(event.query.sql)
      logger.error(event.queryDurationMillis)
    }
  }
})

export const pool = createPoolPromise({
  database: 'kitabuatevent',
  host: 'localhost',
  user: 'root',
  password: 'admin',
  port: 3306,
  connectionLimit: 10,
});

export default db