import { ParserState, ParserTransformer } from "./types";

export class Parser<T> {
  parserStateTransformerFn: ParserTransformer<T>;

  constructor(parserStateTransformerFn: ParserTransformer<T>) {
    this.parserStateTransformerFn = parserStateTransformerFn;
  }

  run(target: T) {
    const initialState: ParserState<T> = {
      target,
      index: 0,
      result: undefined,
      isError: false,
      error: undefined
    };

    return this.parserStateTransformerFn(initialState);
  }

  chain(fn: (result: T) => Parser<T>) {
    return new Parser((parserState: ParserState<T>) => {
      const nextState = this.parserStateTransformerFn(parserState);

      if (nextState.isError) return nextState;

      const nextParser = fn(nextState.result as T);
      return nextParser.parserStateTransformerFn(nextState);
    });
  }

  map(fn: (result: T) => any) {
    return new Parser((parserState: ParserState<T>) => {
      const nextState = this.parserStateTransformerFn(parserState);

      if (nextState.isError) return nextState;

      return updateParserResult(nextState, fn(nextState.result as T));
    });
  }

  errorMap(fn: (errorMsg: string, index: number) => any) {
    return new Parser((parserState: ParserState<T>) => {
      const nextState = this.parserStateTransformerFn(parserState);

      if (!nextState.isError) return nextState;

      return updateParserError(
        nextState,
        fn(nextState.error ?? "", nextState.index)
      );
    });
  }
}

export const updateParserState = <T>(
  state: ParserState<T>,
  index: number,
  result: any
): ParserState<T> => ({
  ...state,
  index,
  result
});

export const updateParserResult = <T>(
  state: ParserState<T>,
  result: any
): ParserState<T> => ({
  ...state,
  result
});

export const updateParserError = <T>(
  state: ParserState<T>,
  errorMsg: string
): ParserState<T> => ({
  ...state,
  error: errorMsg,
  isError: true
});
