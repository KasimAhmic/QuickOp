import { Operation, OperationProps } from './operation';
import { X, Y, Z, F, Codes } from './util/operation-util';

export interface TwoDAdaptiveProps extends OperationProps {
  zPasses: number;
}

export class TwoDAdaptive extends Operation<TwoDAdaptiveProps> {
  private readonly zPasses: number;

  constructor(props: TwoDAdaptiveProps) {
    super(props, TwoDAdaptive.name);

    this.zPasses = props.zPasses;
  }

  // TODO: Originally made as a Facing Operation but was accidentally
  // fused in my mind with a 2D adaptive... Need to come back around
  // and fix this as it is currently useless.
  generate(): TwoDAdaptive {
    throw new Error('Broken af. DO NOT USE.');

    const { G0 } = Codes;

    for (let zPass = 1; zPass <= this.zPasses; zPass++) {
      let counter = 0;
      let yPasses = 0;
      let xPasses = 0;
      let temp = 0;

      this.addCommand(X(0), Y(0), Z(0), F(this.travelFeedRate));

      this.zPosition = -this.depthOfCut * zPass;

      this.addCommand(X(0), Y(0), Z(this.zPosition), F(200));

      while (temp < 100) {
        switch (counter) {
          case 0:
            this.yPosition = this.stock.height - this.widthOfCut * yPasses;

            yPasses++;
            break;
          case 1:
            this.xPosition = this.stock.width - this.widthOfCut * xPasses;

            xPasses++;
            break;
          case 2:
            this.yPosition = 0 + this.widthOfCut * yPasses;

            yPasses++;
            break;
          case 3:
            this.xPosition = 0 + this.widthOfCut * xPasses;

            xPasses++;
            counter = -1;
            break;
        }

        this.addCommand(G0, X(this.xPosition), Y(this.yPosition), Z(this.zPosition));

        counter++;
        temp++;
      }
    }

    return this;
  }
}
