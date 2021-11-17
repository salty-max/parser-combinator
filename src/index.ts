import { ParserState, ParserTransformer } from "./types";

class Parser<T> {
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

const updateParserState = <T>(
  state: ParserState<T>,
  index: number,
  result: T
): ParserState<T> => ({
  ...state,
  index,
  result
});

const updateParserResult = <T>(
  state: ParserState<T>,
  result: T
): ParserState<T> => ({
  ...state,
  result
});

const updateParserError = <T>(
  state: ParserState<T>,
  errorMsg: string
): ParserState<T> => ({
  ...state,
  error: errorMsg,
  isError: true
});

const str = (s: string) =>
  new Parser<string>((parserState: ParserState<string>) => {
    const { target, index, isError } = parserState;

    if (isError) {
      return parserState;
    }

    const slicedTarget = target.slice(index);

    if (slicedTarget.length === 0) {
      return updateParserError(
        parserState,
        `str: Tried to match "${s}", but got Unexpected end of input.`
      );
    }

    if (slicedTarget.startsWith(s)) {
      return updateParserState(parserState, index + s.length, s);
    }

    return updateParserError(
      parserState,
      `str: Tried to match ${s}, but got ${target.slice(index, index + 10)}`
    );
  });

const letterRegex = /^[A-Za-z]+/;

const letters = new Parser<string>((parserState: ParserState<string>) => {
  const { target, index, isError } = parserState;

  if (isError) {
    return parserState;
  }

  const slicedTarget = target.slice(index);

  if (slicedTarget.length === 0) {
    return updateParserError(
      parserState,
      `letters: Got Unexpected end of input.`
    );
  }

  const regexMatch = slicedTarget.match(letterRegex);

  if (regexMatch) {
    return updateParserState(
      parserState,
      index + regexMatch[0].length,
      regexMatch[0]
    );
  }

  return updateParserError(
    parserState,
    `letters: Couldn't match letters @ index ${index}`
  );
});

const digitRegex = /^[0-9]+/;

const digits = new Parser<string>((parserState: ParserState<string>) => {
  const { target, index, isError } = parserState;

  if (isError) {
    return parserState;
  }

  const slicedTarget = target.slice(index);

  if (slicedTarget.length === 0) {
    return updateParserError(
      parserState,
      `digits: Got Unexpected end of input.`
    );
  }

  const regexMatch = slicedTarget.match(digitRegex);

  if (regexMatch) {
    return updateParserState(
      parserState,
      index + regexMatch[0].length,
      regexMatch[0]
    );
  }

  return updateParserError(
    parserState,
    `digits: Couldn't match digits @ index ${index}`
  );
});

const sequenceOf = (parsers: Array<Parser<any>>) =>
  new Parser<any>((parserState: ParserState<any>) => {
    if (parserState.isError) {
      return parserState;
    }

    const results = [];
    let nextState = parserState;

    for (const p of parsers) {
      nextState = p.parserStateTransformerFn(nextState);
      results.push(nextState.result);
    }

    return updateParserResult(nextState, results);
  });

const choice = (parsers: Array<Parser<any>>) =>
  new Parser<any>((parserState: ParserState<any>) => {
    if (parserState.isError) {
      return parserState;
    }

    for (const p of parsers) {
      const nextState = p.parserStateTransformerFn(parserState);
      if (!nextState.isError) return nextState;
    }

    return updateParserError(
      parserState,
      `choice: Unable to match with any parser @ index ${parserState.index}`
    );
  });

const many = (parser: Parser<any>) =>
  new Parser<any>((parserState: ParserState<any>) => {
    if (parserState.isError) {
      return parserState;
    }

    let nextState = parserState;
    const results = [];
    let done = false;

    while (!done) {
      const testState = parser.parserStateTransformerFn(nextState);
      if (!testState.isError) {
        results.push(testState.result);
        nextState = testState;
      } else {
        done = true;
      }
    }

    return updateParserResult(nextState, results);
  });

const manyOne = (parser: Parser<any>) =>
  new Parser<any>((parserState: ParserState<any>) => {
    if (parserState.isError) {
      return parserState;
    }

    let nextState = parserState;
    const results = [];
    let done = false;

    while (!done) {
      nextState = parser.parserStateTransformerFn(nextState);
      if (!nextState.isError) {
        results.push(nextState.result);
      } else {
        done = true;
      }
    }

    if (results.length === 0) {
      return updateParserError(
        parserState,
        `manyOne: Unable to match any input using parser @ index ${parserState.index}`
      );
    }

    return updateParserResult(nextState, results);
  });

const parser = many(choice([letters, digits])).map((res) => [...res].reverse());

console.log(parser.run("dqsf213dsdsqs1231"));
