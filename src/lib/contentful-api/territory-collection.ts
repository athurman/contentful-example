import { graphql } from '@/gql';
import { queryContentful } from './contentful-api';
import { ExecutionResult } from 'graphql';
import { TerritoryContentQuery, TerritoryContentQueryVariables, TerritoryStaticParamsCollectionQuery } from '@/gql/graphql';

// ****************************
// * Queries
// ****************************
const queryTerritoryStaticParamsCollection = graphql(/* GraphQL */ `
  query TerritoryStaticParamsCollection($preview: Boolean!) {
    territoryCollection(preview: $preview) {
      items {
        territoryName
      }
    }
  }
`);

const queryTerritoryContent = graphql(/* GraphQL */ `
  query TerritoryContent($preview: Boolean!, $territoryName: String!) {
    territoryCollection(
      limit: 1
      preview: $preview
      where: { territoryName: $territoryName }
    ) {
      items {
        territoryName
        heroHeader
        heroImageUrl
        activitiesCollection(preview: $preview) {
          items {
            ...TouristActivity
          }
        }
      }
    }
  }
`);

// ****************************
// * GraphQL Requests
// ****************************
export async function getTerritoryStaticParams() {
  const result: ExecutionResult<TerritoryStaticParamsCollectionQuery, any> = await queryContentful({
    document: queryTerritoryStaticParamsCollection,
    variables: {
      preview: process.env.NODE_ENV !== 'production',
    },
  });

  return result;
}

export async function getTerritoryContent({
  territoryName
}: TerritoryContentQueryVariables) {
  const result: ExecutionResult<TerritoryContentQuery, any> = await queryContentful({
    document: queryTerritoryContent,
    variables: {
      preview: process.env.NODE_ENV !== 'production',
      territoryName,
    },
  });

  return result.data?.territoryCollection?.items[0];
}
