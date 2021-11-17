// interface ParserState<T> {
//   target: T;
//   index: number;
//   result?: T | Array<T>;
// }

// type Parser<T> = (state: ParserState<T>) => ParserState<T>;

const updateParserState = (state: any, index: number, result: any) => ({
  ...state,
  index,
  result
});

const updateParserResult = (state: any, result: any) => ({
  ...state,
  result
});

const updateParserError = (state: any, errorMsg: string) => ({
  ...state,
  error: errorMsg,
  isError: true
});

const str = (s: string) => (parserState: any) => {
  const { target, index, isError } = parserState;

  if (isError) {
    return parserState;
  }

  if (target.slice(index).startsWith(s)) {
    return updateParserState(parserState, index + s.length, s);
  }

  return updateParserError(
    parserState,
    `Tried to match ${s}, but got ${target.slice(index, index + 10)}`
  );
};

const sequenceOf = (parsers: Array<any>) => (parserState: any) => {
  if (parserState.isError) {
    return parserState;
  }

  const results = [];
  let nextState = parserState;

  for (const p of parsers) {
    nextState = p(nextState);
    results.push(nextState.result);
  }

  return updateParserResult(nextState, results);
};

const run = (parser: any, target: string) => {
  const initialState = {
    target,
    index: 0,
    result: null,
    isError: false,
    error: null
  };

  return parser(initialState);
};

const parser = str("Hello");

console.log(run(parser, "Hello"));
