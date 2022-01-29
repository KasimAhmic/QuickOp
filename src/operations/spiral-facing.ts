import Decimal from 'decimal.js';
import { Operation, OperationProps } from '../operation';
import { OperationUtil } from '../util';

export interface SpiralFacingOperationProps extends OperationProps {
  zPasses: number;
}

export class SpiralFacingOperation extends Operation<SpiralFacingOperationProps> {
  private readonly zPasses: number;
  private readonly calculationPrecision = 7;
  private readonly stockDiameter: number;

  constructor(props: SpiralFacingOperationProps) {
    super(props, SpiralFacingOperation.name);

    this.logger.warn('This opreation is still a WIP. It may not work as expected.');

    if (props.stock.width !== props.stock.depth) {
      throw new Error('Stock width and depth must be equal');
    }

    this.stockDiameter = props.stock.width;
    this.zPasses = props.zPasses;
  }

  protected generator(): SpiralFacingOperation {
    this.logger.log('Generating Spiral Facing GCODE...');

    const { G0, X, Y, Z, F } = OperationUtil.setup(this);

    this.addComment('Starting Spiral Facing Operation');

    for (let i = 0; i < 7200; i++) {
      const angle = new Decimal(i).mul(Math.PI).div(180);

      const sineOfAngle = new Decimal(angle).sin().toFixed(this.calculationPrecision);
      const cosineOfAngle = new Decimal(angle).cos().toFixed(this.calculationPrecision);

      this.xPosition = new Decimal(this.widthOfCut)
        .div(Math.PI * 2)
        .mul(angle)
        .mul(sineOfAngle);

      this.yPosition = new Decimal(this.widthOfCut)
        .div(Math.PI * 2)
        .mul(angle)
        .mul(cosineOfAngle);

      this.addCommand(G0, X(), Y(), F(this.cuttingFeedRate));
    }

    return this;
  }
}

const op = new SpiralFacingOperation({
  stock: {
    width: 100,
    height: 10,
    depth: 100,
  },
  widthOfCut: 1,
  depthOfCut: 2,
  toolDiameter: 3.175,
  cuttingFeedRate: 1600,
  travelFeedRate: 2400,
  plungeFeedRate: 200,
  leadInFeedRate: 200,
  zPasses: 2,
});

op.generate().writeToFile('spiral-facing').calculateStats();
