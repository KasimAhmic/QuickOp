import { Operation, OperationProps } from '../operation';
import { OperationUtil } from '../util';
import { Decimal } from 'decimal.js';

export interface PolygonProps extends OperationProps {
  numberOfSides: number;
  sideLength: number;
  zPasses: number;
}

export class PolygonOperation extends Operation<PolygonProps> {
  private readonly numberOfSides: number;
  private readonly sideLength: number;
  private readonly zPasses: number;

  constructor(props: PolygonProps) {
    super(props, PolygonOperation.name);

    this.logger.warn('This operation is still a WIP. It may not work as expected.');

    this.numberOfSides = props.numberOfSides;
    this.sideLength = props.sideLength;
    this.zPasses = props.zPasses;
  }

  toRadians(degrees: Decimal): Decimal {
    return degrees.mul(Math.PI).div(180);
  }

  protected generator(): PolygonOperation {
    const { G0, X, Y, Z, F } = OperationUtil.setup(this);

    this.zPosition = new Decimal(5);

    this.addCommand(G0, X(), Y(), Z(), F(this.travelFeedRate));

    // Angle inside the polygon at the vertex
    const interiorAngle = new Decimal(this.numberOfSides - 2).div(this.numberOfSides).mul(180);

    // Angle between the side of the polygon and an extended adjacent side
    const exteriorAngle = this.toRadians(new Decimal(180).sub(interiorAngle).div(2));

    // TODO: Figure out what the hell this is...
    const cosecant = new Decimal(1).div(new Decimal(Math.PI).div(this.numberOfSides).sin());

    // Radius of the circumscribed circle of the polygon
    const circumradius = new Decimal(0.5).mul(this.sideLength).mul(cosecant);

    // TODO: Also figure out what this is...
    const centerAngle = new Decimal(2 * Math.PI).div(this.numberOfSides);

    for (let zPass = 1; zPass <= this.zPasses; zPass++) {
      for (let side = 0; side <= this.numberOfSides; side++) {
        const angle = centerAngle.mul(side).add(exteriorAngle);

        const sineOfAngle = angle.sin();
        const cosineOfAngle = angle.cos();

        this.xPosition = circumradius.mul(cosineOfAngle);
        this.yPosition = circumradius.mul(sineOfAngle);

        if (side === 0) {
          this.addCommand(G0, X(), Y(), F(this.travelFeedRate));

          this.zPosition = new Decimal(this.depthOfCut).mul(-zPass);

          this.addCommand(G0, Z(), F(this.plungeFeedRate));
        } else {
          this.addCommand(G0, X(), Y(), Z(), F(this.cuttingFeedRate));
        }
      }
    }

    this.zPosition = new Decimal(5);

    this.addCommand(G0, Z(), F(this.leadInFeedRate));

    this.xPosition = new Decimal(0);
    this.yPosition = new Decimal(0);

    this.addCommand(G0, X(), Y(), F(this.travelFeedRate));

    return this;
  }
}

const op = new PolygonOperation({
  numberOfSides: 6,
  sideLength: 20,
  widthOfCut: 1,
  depthOfCut: 2,
  zPasses: 3,
  stock: {
    width: 20,
    depth: 20,
    height: 201,
  },
  toolDiameter: 3,
  travelFeedRate: 100,
  plungeFeedRate: 100,
  cuttingFeedRate: 100,
  leadInFeedRate: 100,
});

op.generate().writeToFile('polygon.gcode').calculateStats();
