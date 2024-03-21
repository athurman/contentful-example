import {
  buildHTTPExecutor,
  HTTPExecutorOptions,
} from '@graphql-tools/executor-http';
import { AsyncExecutor } from '@graphql-tools/utils';
import { DocumentNode, Kind } from 'graphql';

export function getOperationName(query: DocumentNode): string | undefined {
  for (const node of query.definitions) {
    if (node.kind === Kind.OPERATION_DEFINITION && node.name) {
      return node.name.value;
    }
  }
}

const authToken = process.env.NODE_ENV === 'production'
  ? process.env.CONTENTFUL_ACCESS_TOKEN!
  : process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN!;

export const CONTENTFUL_URL = `https://graphql.contentful.com/content/v1/spaces/${process
  .env.CONTENTFUL_SPACE_ID!}/environments/master`;


export function createHTTPExecutor(options: HTTPExecutorOptions): AsyncExecutor {
  const httpExecutor = buildHTTPExecutor(options);

  return async ({
    document,
    operationName = getOperationName(document),
    extensions,
    ...request
  }) => {
    const headers = new Headers(
      typeof extensions?.headers === 'function'
        ? extensions.headers(request)
        : extensions?.headers,
    );

    return httpExecutor({
      ...request,
      document,
      operationName,
      extensions: {
        ...extensions,
        headers: Object.fromEntries(headers),
      },
    });
  };
}

export const contentfulExecutor = () =>
  createHTTPExecutor({
    endpoint: CONTENTFUL_URL,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
