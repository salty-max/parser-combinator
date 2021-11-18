import { compute } from "./micro-language";

export { ParserState, ParserTransformer } from "./types";
export {
  Parser,
  updateParserError,
  updateParserResult,
  updateParserState
} from "./parser";
export {
  between,
  choice,
  digits,
  lazy,
  letters,
  many,
  manyOne,
  sepBy,
  sequenceOf,
  str
} from "./parsers";

const program = "(+ (* 10 2) (- (/ 50 3) 2))";
console.log(compute(program));
