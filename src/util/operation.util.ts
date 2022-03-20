import { Operation, OperationProps } from '../operation';
import Decimal from 'decimal.js';

export class OperationUtil {
  static Codes = {
    G0: 'G0',
    G1: 'G1',
  };

  static setup(operation: Operation<OperationProps>) {
    return {
      X: (xPosition?: Decimal) => `X${xPosition ?? operation.xPosition.toFixed(operation.getPrecision())}`,
      Y: (yPosition?: Decimal) => `Y${yPosition ?? operation.yPosition.toFixed(operation.getPrecision())}`,
      Z: (zPosition?: Decimal) => `Z${zPosition ?? operation.zPosition.toFixed(operation.getPrecision())}`,
      F: (feedrate: number) => `F${feedrate}`,
      ...OperationUtil.Codes,
    };
  }
}
