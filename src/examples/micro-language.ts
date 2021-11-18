/**
 * Add:         (+ 10 2)
 * Substract:   (- 10 2)
 * Multiply:    (* 10 2)
 * Divide:      (/ 10 2)
 *
 * Nested calculations: (+ (* 10 2) (- 10 2))
 */

import { between, choice, digits, lazy, sequenceOf, str } from "../parsers";

const betweenBrackets = between(str("("), str(")"));

const numberParser = digits.map((x) => ({
  type: "number",
  value: Number(x)
}));

const operatorParser = choice([str("+"), str("-"), str("*"), str("/")]);

const expr = lazy(() => choice([numberParser, operationParser]));

const operationParser = betweenBrackets(
  sequenceOf([operatorParser, str(" "), expr, str(" "), expr])
).map((results) => ({
  type: "operation",
  value: {
    op: results[0],
    a: results[2],
    b: results[4]
  }
}));

type Node = {
  type: string;
  value: any;
};

const evaluate = (node: Node): any => {
  if (node.type === "number") {
    return node.value;
  }

  if (node.type === "operation") {
    switch (node.value.op) {
      case "+": {
        return evaluate(node.value.a) + evaluate(node.value.b);
      }
      case "-": {
        return evaluate(node.value.a) - evaluate(node.value.b);
      }
      case "*": {
        return evaluate(node.value.a) * evaluate(node.value.b);
      }
      case "/": {
        return evaluate(node.value.a) / evaluate(node.value.b);
      }
    }
  }
};

const compute = (program: string) => {
  const parseResult = expr.run(program);
  if (parseResult.isError) {
    throw new Error("Invalid program");
  }

  return evaluate(parseResult.result);
};

const program = "(+ (* 10 2) (- (/ 50 3) 2))";
console.log(compute(program));
