import 'server-only';

import { Document } from '@contentful/rich-text-types';
import {
  ExecutionRequest,
  ExecutionResult,
  MaybeAsyncIterable,
} from '@graphql-tools/utils';
import { isAsyncIterable } from '@/utils/async-iterable';
import { contentfulExecutor } from '@/utils/http-executor';


export interface Asset {
  sys?: {
    id?: string;
  };
  url?: string;
  description?: string;
}

export interface AssetLink {
  block: Asset[];
}

export interface Content {
  json: Document;
  links: {
    assets: AssetLink;
  };
}

export interface EnrollmentStepParams {
  product: string;
  partner: string;
  presentation: string;
}

export async function queryContentful<
  TVariables extends Record<string, any>,
  TContext = any,
  TRootValue = any,
  TExtensions = any,
  TReturn = any,
>({
  document,
  variables,
}: ExecutionRequest<
  TVariables,
  TContext,
  TRootValue,
  TExtensions,
  TReturn
>): Promise<ExecutionResult<TReturn, TExtensions>> {
  const executor = contentfulExecutor();
  const result: MaybeAsyncIterable<ExecutionResult<TReturn, any>> = await executor({
    document,
    variables,
  });

  if (isAsyncIterable(result)) {
    throw new Error('unexpected AsyncIterable response');
  }

  return result;
}
