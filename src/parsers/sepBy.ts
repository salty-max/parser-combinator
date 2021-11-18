import { Parser, updateParserError, updateParserResult } from "../parser";
import { ParserState } from "../types";

export const sepBy =
  (separatorParser: Parser<any>) => (valueParser: Parser<any>) =>
    new Parser((parserState: ParserState<any>) => {
      if (parserState.isError) return parserState;

      const results = [];
      let nextState = parserState;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const valueState = valueParser.parserStateTransformerFn(nextState);
        if (valueState.isError) break;

        results.push(valueState.result);
        nextState = valueState;

        const separatorState =
          separatorParser.parserStateTransformerFn(nextState);
        if (separatorState.isError) break;
        nextState = separatorState;
      }

      if (results.length === 0) {
        return updateParserError(
          parserState,
          `SepBy: Unable to capture any results @ index ${parserState.index}`
        );
      }

      return updateParserResult(nextState, results);
    });
