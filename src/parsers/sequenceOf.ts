import { Parser, updateParserResult } from "../parser";
import { ParserState } from "../types";

export const sequenceOf = (parsers: Array<Parser<any>>) =>
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
