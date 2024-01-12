import mysql from 'mysql2/promise';
import pg from 'pg';
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from '../config.js';

// MySQL
export const connection = await mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  port: DB_PORT,
  password: DB_PASS,
  database: DB_NAME
});

// PostgreSQL
const { Pool } = pg;
export const pool = new Pool();
