import { between } from "./parsers/between";
import { digits } from "./parsers/digits";
import { letters } from "./parsers/letters";
import { sequenceOf } from "./parsers/sequenceOf";
import { str } from "./parsers/str";

export { str } from "./parsers/str";
export { choice } from "./parsers/choice";
export { digits } from "./parsers/digits";
export { letters } from "./parsers/letters";
export { many, manyOne } from "./parsers/many";
export { sequenceOf } from "./parsers/sequenceOf";
export { between } from "./parsers/between";

const stringParser = letters.map((result) => ({
  type: "string",
  value: result
}));

const numberParser = digits.map((result) => ({
  type: "number",
  value: Number(result)
}));

const dicerollParser = sequenceOf([digits, str("d"), digits]).map(
  ([n, _, s]) => ({
    type: "diceroll",
    value: [Number(n), Number(s)]
  })
);

const parser = sequenceOf([letters, str(":")])
  .map((results) => results[0])
  .chain((type: string) => {
    if (type === "string") {
      return stringParser;
    } else if (type === "number") {
      return numberParser;
    }

    return dicerollParser;
  });

console.log(parser.run("diceroll:2d10"));
