// import pkg from 'pg';
// const { Pool } = pkg;
// import dotenv from 'dotenv';

// dotenv.config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });
// console.log("in db.js")
// export default pool;

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});



// Test the connection
pool.query('SELECT NOW()')
  .then(res => console.log('DB Connected at:', res.rows[0].now))
  .catch(err => console.error('DB connection error:', err));

export default pool;

console.log("in db.js");
