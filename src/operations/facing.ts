import Decimal from 'decimal.js';
import { Operation, OperationProps } from '../operation';
import { OperationUtil } from '../util';

export interface FacingOperationProps extends OperationProps {
  zPasses: number;
  cutBothWays: boolean;
}

export class FacingOperation extends Operation<FacingOperationProps> {
  private readonly zPasses: number;
  private readonly cutBothWays: boolean;

  constructor(props: FacingOperationProps) {
    super(props, FacingOperation.name);

    this.zPasses = props.zPasses;
    this.cutBothWays = props.cutBothWays;
  }

  protected generator(): FacingOperation {
    this.logger.log('Generating Facing GCODE...');

    const { G0, X, Y, Z, F } = OperationUtil.setup(this);

    this.addComment('Starting Facing Operation');

    for (let zPass = 1; zPass <= this.zPasses; zPass++) {
      let xPasses = 1;

      this.xPosition = new Decimal(this.stock.width).add(this.toolDiameter);
      this.yPosition = new Decimal(-this.toolDiameter);
      this.zPosition = new Decimal(5);

      this.addCommand(G0, X(), Y(), Z(), F(this.travelFeedRate));

      this.zPosition = new Decimal(-this.depthOfCut).mul(zPass);

      this.addCommand(G0, Z(), F(this.plungeFeedRate));

      while (xPasses * this.widthOfCut < this.stock.depth + this.toolDiameter) {
        this.yPosition = new Decimal(xPasses).mul(this.widthOfCut);

        this.addCommand(G0, Y(), F(this.leadInFeedRate));

        this.xPosition = new Decimal(-this.toolDiameter);

        this.addCommand(G0, X(), F(this.cuttingFeedRate));

        xPasses++;

        if (this.cutBothWays) {
          this.yPosition = new Decimal(xPasses).mul(this.widthOfCut);

          this.addCommand(G0, Y(), F(this.leadInFeedRate));

          this.xPosition = new Decimal(this.stock.width).add(this.toolDiameter);

          this.addCommand(G0, X(), F(this.cuttingFeedRate));

          xPasses++;
        } else {
          this.xPosition = new Decimal(this.stock.width).add(this.toolDiameter);

          this.addCommand(G0, X(), F(this.travelFeedRate));
        }
      }

      this.zPosition = new Decimal(5);

      this.addCommand(G0, Z(), F(this.plungeFeedRate));

      this.addComment('Facing Operation Complete');
    }

    this.logger.log('Finished generating Facing GCODE!');

    return this;
  }
}

const t = new FacingOperation({
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
  cutBothWays: true,
});

t.generate().calculateStats().writeToFile('facing');
