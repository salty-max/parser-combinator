import createMemory from "./create-memory";
import CPU from "./cpu";
import { ADD_REG_REG, MOV_LIT_R1, MOV_LIT_R2 } from "./instructions";

const memory = createMemory(256);
const writableBytes = new Uint8Array(memory.buffer);

const cpu = new CPU(memory);

writableBytes[0] = MOV_LIT_R1;
writableBytes[1] = 0x12; // 0x1234
writableBytes[2] = 0x34;

writableBytes[3] = MOV_LIT_R2;
writableBytes[4] = 0xab; // 0xABCD
writableBytes[5] = 0xcd;

writableBytes[6] = ADD_REG_REG;
writableBytes[7] = 2; // r1 index
writableBytes[8] = 3; // r2 index

cpu.debug();
cpu.step();
cpu.debug();
cpu.step();
cpu.debug();
cpu.step();
cpu.debug();
