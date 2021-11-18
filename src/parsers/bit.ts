import { Parser, ParserState, updateParserError, updateParserState } from "..";

export type Binary = Uint8Array | Uint16Array | Uint32Array;

export type BinaryArray = ArrayBuffer | DataView;

export const bit = new Parser<DataView>(
  (parserState: ParserState<DataView>) => {
    if (parserState.isError) return parserState;

    // Round index to nearest byte
    const byteOffset = Math.floor(parserState.index / 8);

    if (byteOffset >= parserState.target.byteLength)
      return updateParserError(parserState, `Bit: Unexpected end of input.`);

    const byte = parserState.target.getUint8(byteOffset);
    // Reverse index to start at the first bit LTR
    const bitOffset = 7 - (parserState.index % 8);
    const result = (byte & (1 << bitOffset)) >> bitOffset;

    return updateParserState(parserState, parserState.index + 1, result);
  }
);

export const zero = new Parser<DataView>(
  (parserState: ParserState<DataView>) => {
    if (parserState.isError) return parserState;

    // Round index to nearest byte
    const byteOffset = Math.floor(parserState.index / 8);

    if (byteOffset >= parserState.target.byteLength)
      return updateParserError(parserState, `Zero: Unexpected end of input.`);

    const byte = parserState.target.getUint8(byteOffset);
    // Reverse index to start at the first bit LTR
    const bitOffset = 7 - (parserState.index % 8);
    const result = (byte & (1 << bitOffset)) >> bitOffset;

    if (result !== 0)
      return updateParserError(
        parserState,
        `Zero: Expected 0, but got 1 @ index ${parserState.index}.`
      );

    return updateParserState(parserState, parserState.index + 1, result);
  }
);

export const one = new Parser<DataView>(
  (parserState: ParserState<DataView>) => {
    if (parserState.isError) return parserState;

    // Round index to nearest byte
    const byteOffset = Math.floor(parserState.index / 8);

    if (byteOffset >= parserState.target.byteLength)
      return updateParserError(parserState, `One: Unexpected end of input.`);

    const byte = parserState.target.getUint8(byteOffset);
    // Reverse index to start at the first bit LTR
    const bitOffset = 7 - (parserState.index % 8);
    const result = (byte & (1 << bitOffset)) >> bitOffset;

    if (result !== 1)
      return updateParserError(
        parserState,
        `One: Expected 1, but got 0 @ index ${parserState.index}.`
      );

    return updateParserState(parserState, parserState.index + 1, result);
  }
);
