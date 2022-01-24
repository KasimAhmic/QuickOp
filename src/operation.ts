import Big from 'big.js';
import { createWriteStream } from 'fs';
import { Logger } from './logger';
import { Stock } from './stock';

export interface OperationProps {
  stock: Stock;
  widthOfCut: number;
  depthOfCut: number;
  toolDiameter: number;
  cuttingFeedRate: number;
  travelFeedRate: number;
  plungeFeedRate: number;
  leadInFeedRate: number;
}

export interface Stats {
  commandCount: number;
  commentCount: number;
  totalLines: number;
  sizeInBytes: number;
  sizeInKiloBytes: number;
  sizeInMegaBytes: number;
}

export class Operation<PropsType extends OperationProps> {
  protected readonly widthOfCut: number;
  protected readonly depthOfCut: number;
  protected readonly toolDiameter: number;
  protected readonly cuttingFeedRate: number;
  protected readonly travelFeedRate: number;
  protected readonly plungeFeedRate: number;
  protected readonly leadInFeedRate: number;

  xPosition: Big;
  yPosition: Big;
  zPosition: Big;

  gcode: string[];
  stock: Stock;
  logger: Logger;

  stats: Stats;

  constructor(props: PropsType, loggerName?: string) {
    this.widthOfCut = props.widthOfCut;
    this.depthOfCut = props.depthOfCut;
    this.toolDiameter = props.toolDiameter;
    this.cuttingFeedRate = props.cuttingFeedRate;
    this.travelFeedRate = props.travelFeedRate;
    this.plungeFeedRate = props.plungeFeedRate;
    this.leadInFeedRate = props.leadInFeedRate;

    this.xPosition = Big(0);
    this.yPosition = Big(0);
    this.zPosition = Big(0);

    this.gcode = [];
    this.stock = props.stock;
    this.logger = new Logger(loggerName || Operation.name);

    this.stats = {
      commandCount: 0,
      commentCount: 0,
      totalLines: 0,
      sizeInBytes: 0,
      sizeInKiloBytes: 0,
      sizeInMegaBytes: 0,
    };
  }

  generate(): Operation<PropsType> {
    throw new Error('Method not implemented.');
  }

  addCommand(...args: string[]): void {
    this.gcode.push(args.join(' '));
    this.stats.commandCount++;
  }

  addComment(...args: string[]): void {
    this.gcode.push(`; ${args.join(' ')}`);
    this.stats.commentCount++;
  }

  calculateStats(): Operation<PropsType> {
    this.stats.totalLines = this.gcode.length;
    this.stats.sizeInBytes = Buffer.byteLength(this.gcode.join('\n'));
    this.stats.sizeInKiloBytes = this.stats.sizeInBytes / 1024;
    this.stats.sizeInMegaBytes = this.stats.sizeInKiloBytes / 1024;

    this.logger.table(
      ['Description', 'Value'],
      ['Lines of GCODE', this.stats.totalLines],
      ['Total Commands', this.stats.commandCount],
      ['Total Comments', this.stats.commentCount],
      ['Size in Bytes', this.stats.sizeInBytes],
      ['Size in Kilobytes', this.stats.sizeInKiloBytes.toFixed(2)],
      ['Size in Megabytes', this.stats.sizeInMegaBytes.toFixed(2)],
    );

    return this;
  }

  writeToFile(fileName: string): Operation<PropsType> {
    let fileNameWithExtension = fileName;

    if (!fileNameWithExtension.endsWith('.gcode')) {
      fileNameWithExtension += '.gcode';
    }

    // TODO: Investigate replace createWriteStream with writeFile since we already have all
    // the data in memory
    const writeStream = createWriteStream(fileNameWithExtension);

    for (const line of this.gcode) {
      writeStream.write(line + '\n');
    }

    writeStream.close();

    this.logger.log(`GCODE file '${fileNameWithExtension}' saved`);

    return this;
  }
}
