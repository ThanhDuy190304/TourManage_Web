module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'managetour-managetour.k.aivencloud.com',
      user: 'avnadmin',
      password: 'AVNS_opeGsM8oNaX5iQGMM9H',
      database: 'defaultdb',
      port: 18236,
      ssl: { rejectUnauthorized: false }
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
