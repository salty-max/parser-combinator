import { Parser } from "../parser";
import { ParserState } from "../types";

export const lazy = (parserThunk: () => Parser<any>) =>
  new Parser((parserState: ParserState<any>) => {
    const parser = parserThunk();

    return parser.parserStateTransformerFn(parserState);
  });
