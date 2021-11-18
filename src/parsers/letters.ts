import { Parser, updateParserError, updateParserState } from "../parser";
import { ParserState } from "../types";

const letterRegex = /^[A-Za-z]+/;

export const letters = new Parser<string>(
  (parserState: ParserState<string>) => {
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
  }
);
