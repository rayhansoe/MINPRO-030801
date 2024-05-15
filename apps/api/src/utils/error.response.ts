export class ResponseError extends Error {

  constructor(public status: number, public message: string, public isQuery = false) {
    super(message)
  }
  
}

export interface DatabaseError extends Error {
  /**
   * Either a MySQL server error (e.g. 'ER_ACCESS_DENIED_ERROR'),
   * a node.js error (e.g. 'ECONNREFUSED') or an internal error
   * (e.g. 'PROTOCOL_CONNECTION_LOST').
   */
  code: string;

  /**
   * The sql state marker
   */
  sqlStateMarker?: string;

  /**
   * The sql state
   */
  sqlState?: string;

  /**
   * The sql query
   */
  sql?: string;

  /**
   * The sql message
   */
  sqlMessage?: string;

  /**
   * The field count
   */
  fieldCount?: number;

  /**
   * Boolean, indicating if this error is terminal to the connection object.
   */
  fatal: boolean;
}

export function isDatabaseError(err: object): err is DatabaseError {
  return (err as DatabaseError).sqlMessage !== undefined;
}