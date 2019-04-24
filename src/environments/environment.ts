export const environment = {
  production: false,
  auth: true,
  database: {
    description: 'Eowyn Reconsidere Enterprise Development Mongo DataBase',
    username: 'reconsidere-enterprise',
    password: 'by4yY5A4',
    host: 'ec2-18-216-31-156.us-east-2.compute.amazonaws.com',
    port: '27017',
    dbname: 'reconsideredb',
    uri: `http://localhost:32546`
  },
  api: {
    auth: {
      uri: `localhost:32546`
    },
    persistence: {
      uri: `localhost:32546`
    },
    publish: {
      uri: `localhost:32546`
    },
    external: {
      uri: `localhost:32546`
    },
    uri: 'localhost:32546'
  },
  secret: '154097$#@$^@1ETI',
};
