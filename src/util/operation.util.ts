import { Operation, OperationProps } from '../operation';

export class OperationUtil {
  static Codes = {
    G0: 'G0',
    G1: 'G1',
  };

  static setup(operation: Operation<OperationProps>) {
    return {
      X: () => `X${operation.xPosition.toFixed(operation.getPrecision())}`,
      Y: () => `Y${operation.yPosition.toFixed(operation.getPrecision())}`,
      Z: () => `Z${operation.zPosition.toFixed(operation.getPrecision())}`,
      F: (feedrate: number) => `F${feedrate}`,
      ...OperationUtil.Codes,
    };
  }
}
