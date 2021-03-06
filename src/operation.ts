import Decimal from 'decimal.js';
import { createWriteStream } from 'fs';
import { Timer, Logger } from './util';
import { Stock } from './stock';
import { GcodeValidator } from './util/gcode-validator';

export interface OperationProps {
  stock: Stock;
  widthOfCut: number;
  depthOfCut: number;
  toolDiameter: number;
  cuttingFeedRate: number;
  travelFeedRate: number;
  plungeFeedRate: number;
  leadInFeedRate: number;
  precision?: number;
}

export interface Stats {
  commandCount: number;
  commentCount: number;
  totalLines: number;
  sizeInBytes: number;
  sizeInKiloBytes: number;
  sizeInMegaBytes: number;
}

enum Phases {
  GCODE_GENERATION = 'GCODE_GENERATION',
  GCODE_VALIDATION = 'GCODE_VALIDATION',
  DISK_WRITE = 'DISK_WRITE',
}

export abstract class Operation<PropsType extends OperationProps> {
  protected readonly widthOfCut: number;
  protected readonly depthOfCut: number;
  protected readonly toolDiameter: number;
  protected readonly cuttingFeedRate: number;
  protected readonly travelFeedRate: number;
  protected readonly plungeFeedRate: number;
  protected readonly leadInFeedRate: number;
  protected readonly precision: number;

  xPosition: Decimal;
  yPosition: Decimal;
  zPosition: Decimal;

  gcode: string[];
  stock: Stock;
  logger: Logger;

  stats: Stats;
  timer: Timer;
  validator: GcodeValidator;

  protected constructor(props: PropsType, loggerName?: string) {
    this.widthOfCut = props.widthOfCut;
    this.depthOfCut = props.depthOfCut;
    this.toolDiameter = props.toolDiameter;
    this.cuttingFeedRate = props.cuttingFeedRate;
    this.travelFeedRate = props.travelFeedRate;
    this.plungeFeedRate = props.plungeFeedRate;
    this.leadInFeedRate = props.leadInFeedRate;
    this.precision = props.precision || 3;

    this.xPosition = new Decimal(0);
    this.yPosition = new Decimal(0);
    this.zPosition = new Decimal(0);

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

    this.timer = new Timer();
    this.validator = new GcodeValidator();
  }

  protected abstract generator(): Operation<OperationProps>;

  generate(): Operation<PropsType> {
    this.timer.start(Phases.GCODE_GENERATION);

    this.generator();

    this.timer.end(Phases.GCODE_GENERATION);

    this.validateGcode();

    return this;
  }

  addCommand(...args: string[]): void {
    this.gcode.push(args.join(' '));
    this.stats.commandCount++;
  }

  addComment(...args: string[]): void {
    this.gcode.push(`; ${args.join(' ')}`);
    this.stats.commentCount++;
  }

  getPrecision(): number {
    return this.precision;
  }

  validateGcode(): Operation<PropsType> {
    this.timer.start(Phases.GCODE_VALIDATION);

    this.validator.validate(this.gcode);

    this.timer.end(Phases.GCODE_VALIDATION);

    return this;
  }

  writeToFile(fileName: string): Operation<PropsType> {
    this.timer.start(Phases.DISK_WRITE);

    let fileNameWithExtension = fileName;

    if (!fileNameWithExtension.endsWith('.gcode')) {
      fileNameWithExtension += '.gcode';
    }

    // TODO: Investigate replacing createWriteStream with writeFile since we already have all the data in memory
    const writeStream = createWriteStream(fileNameWithExtension);

    for (const line of this.gcode) {
      writeStream.write(line + '\n');
    }

    writeStream.close();

    this.timer.end(Phases.DISK_WRITE);

    this.logger.log(`GCODE file '${fileNameWithExtension}' saved.`);

    return this;
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
      ['Time to Generate (sec)', this.timer.elapsedSeconds(Phases.GCODE_GENERATION).toFixed(3)],
      ['Time to Validate (sec)', this.timer.elapsedSeconds(Phases.GCODE_VALIDATION).toFixed(3)],
      ['Time to Write to Disk (sec)', this.timer.elapsedSeconds(Phases.DISK_WRITE).toFixed(3)],
    );

    return this;
  }
}
