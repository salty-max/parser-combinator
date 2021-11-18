import { Parser, updateParserError, updateParserState } from "../parser";
import { ParserState } from "../types";

export const str = (s: string) =>
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
