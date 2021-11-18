import { sequenceOf } from "./sequenceOf";
import { Parser } from "../parser";

export const between =
  (leftParser: Parser<any>, rightParser: Parser<any>) =>
  (contentParser: Parser<any>) =>
    sequenceOf([leftParser, contentParser, rightParser]).map(
      (results) => results[1]
    );
