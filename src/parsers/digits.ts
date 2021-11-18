import { Parser, updateParserError, updateParserState } from "../parser";
import { ParserState } from "../types";

const digitRegex = /^[0-9]+/;

export const digits = new Parser<string>((parserState: ParserState<string>) => {
  const { target, index, isError } = parserState;

  if (isError) {
    return parserState;
  }

  const slicedTarget = target.slice(index);

  if (slicedTarget.length === 0) {
    return updateParserError(
      parserState,
      `Digits: Got Unexpected end of input.`
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
    `Digits: Couldn't match digits @ index ${index}`
  );
});
