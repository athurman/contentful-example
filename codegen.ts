import { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

const CONTENTFUL_URL = `https://graphql.contentful.com/content/v1/spaces/${process
  .env.CONTENTFUL_SPACE_ID!}/environments/master`;

const contentfulSchemaLoader: CodegenConfig['schema'] = {
  [CONTENTFUL_URL]: {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${
        process.env.NODE_ENV !== 'production'
          ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN!
          : process.env.CONTENTFUL_ACCESS_TOKEN!
      }`,
    },
  },
};

const config: CodegenConfig = {
  schema: contentfulSchemaLoader,
  documents: ['src/lib/contentful-api/**/*.ts', 'src/app/**/*.tsx'],
  generates: {
    'schema.graphql': {
      schema: [
        contentfulSchemaLoader,
      ],
      plugins: ['schema-ast'],
    },
    'src/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
