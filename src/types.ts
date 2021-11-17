export interface ParserState<T> {
  target: T;
  index: number;
  result?: T | Array<T>;
  isError?: boolean;
  error?: string;
}

export type ParserTransformer<T> = (state: ParserState<T>) => ParserState<T>;
