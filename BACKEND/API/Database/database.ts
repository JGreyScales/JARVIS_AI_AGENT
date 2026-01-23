import mysql, { Connection } from "mysql";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

interface QueryError {
  statusCode: number;
  message: string;
}

class Database {
  private testing: boolean;
  private connection: Connection | null;

  public transcriptsTable = "Transcripts";
  public usersTable = "Users";
  public familiesTable = "Families";
  public commandsTable = "Commands";
  public usersToFamiliesTable = "UsersToFamilies";
  public familiesToCommandTable = "FamiliesToCommand";
  public gestureDataTable = "GestureData";


  constructor(testing: boolean = false) {
    this.testing = testing;
    this.connection = null;
  }

  async connect(): Promise<void> {
    if (
      !process.env.DB_HOST ||
      !process.env.DB_PORT ||
      !process.env.DB_USER ||
      !process.env.DB_PASS
    ) {
      console.log("No .env file detected, will not connect to database");
    }

    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: this.testing
        ? process.env.TEST_DB_NAME
        : process.env.DB_NAME,
    });

    return new Promise((resolve, reject) => {
      this.connection!.connect((err: any) => {
        if (err) {
          this.connection = null;
          console.log("error connecting");
          return reject(err);
        }
        resolve();
      });
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connection) {
        this.connection.end((err) => {
          if (err) return reject(err);
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  async dropSafety(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection!.query(
        "SET SQL_SAFE_UPDATES = 0",
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }

  async raiseSafety(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection!.query(
        "SET SQL_SAFE_UPDATES = 1",
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }

  // used for write only
  public async submitQuery(
    query: string,
    params: any[],
    bypassNoResult: boolean = false
  ): Promise<any> {
    console.log(
      `TESTING: ${this.testing} | executing: ${mysql.format(query, params)}`
    );

    return new Promise((resolve, reject) => {
      this.connection!.query(query, params, (err, results) => {
        if (err) {
          const error: QueryError = {
            statusCode: 400,
            message: `Database query error: ${err.sqlMessage}`,
          };
          return reject(error);
        }

        if (results.affectedRows === 0 && !bypassNoResult) {
          return reject({
            statusCode: 404,
            message: "No rows updated",
          } as QueryError);
        }

        resolve(results);
      });
    });
  }

  // used for read only
  public async fetchQuery(query: string, params: any[]): Promise<any[]> {
    console.log(
      `TESTING: ${this.testing} | executing: ${mysql.format(query, params)}`
    );

    return new Promise((resolve, reject) => {
      this.connection!.query(query, params, (err, results: any[]) => {
        if (err) {
          return reject({
            statusCode: 400,
            message: `Database query error: ${err.sqlMessage}`,
          } as QueryError);
        }

        if (results.length === 0) {
          return reject({
            statusCode: 404,
            message: "No objects found",
          } as QueryError);
        }

        resolve(results);
      });
    });
  }

  async purgeDatabase(): Promise<void> {
    await this.dropSafety();

    const userQuery = `TRUNCATE TABLE ${this.usersTable}`;
    const transcriptsQuery = `TRUNCATE TABLE ${this.transcriptsTable}`;
    const familiesQuery = `TRUNCATE TABLE ${this.familiesTable}`;
    const commandsQuery = `TRUNCATE TABLE ${this.commandsTable}`;
    const usersToFamiliesQuery = `TRUNCATE TABLE ${this.usersToFamiliesTable}`;
    const familiesToCommandQuery = `TRUNCATE TABLE ${this.familiesToCommandTable}`;
    const gestureDataQuery = `TRUNCATE TABLE ${this.gestureDataTable}`;

    await this.submitQuery(userQuery, [], true);
    await this.submitQuery(transcriptsQuery, [], true);
    await this.submitQuery(familiesQuery, [], true);
    await this.submitQuery(commandsQuery, [], true);
    await this.submitQuery(usersToFamiliesQuery, [], true);
    await this.submitQuery(familiesToCommandQuery, [], true);
    await this.submitQuery(gestureDataQuery, [], true);

    await this.raiseSafety();
  }

  static async getLastInsertID(db: Database): Promise<number> {
      const query = "SELECT LAST_INSERT_ID() AS ID";
      return (await db.fetchQuery(query, []))[0].ID;
  }
}

export default Database;
