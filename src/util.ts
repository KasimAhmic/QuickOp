import { Operation, OperationProps } from './operation';

export const setup = (operation: Operation<OperationProps>) => ({
  X: () => `X${operation.xPosition}`,
  Y: () => `Y${operation.yPosition}`,
  Z: () => `Z${operation.zPosition}`,
  F: (feedrate: number) => `F${feedrate}`,
  ...Codes,
});

export const Codes = {
  G0: 'G0',
  G1: 'G1',
};
