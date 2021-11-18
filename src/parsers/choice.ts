import { Parser, updateParserError } from "../parser";
import { ParserState } from "../types";

export const choice = (parsers: Array<Parser<any>>) =>
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
      `Choice: Unable to match with any parser @ index ${parserState.index}`
    );
  });
