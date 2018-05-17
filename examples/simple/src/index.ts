import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import crud from 'graphql-crud';
import MongoStore from 'graphql-crud-mongo';
import { makeExecutableSchema } from 'graphql-tools';

const PORT = 3000;

const typeDefs = `

type Library @model {
  name: String!
  books: [Book]
  authors: [Author]
}

type Author @model {
  name: String!
  books: [Book]
  relatedAuthors: [Author]
}

type Book @model {
  name: String!
  authors: [Author]
  publishedDate: String
}

type Query {
  _: Boolean
}

type Mutation {
  _: Boolean
}
`;

const schema = makeExecutableSchema({
  typeDefs,
  schemaDirectives: {
    ...crud,
  },
});

const context = {
  directives: {
    model: {
      store: new MongoStore({ connection: 'mongodb://localhost/my-database' }),
    },
  },
};

const app = express();

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema, context }));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(PORT);
