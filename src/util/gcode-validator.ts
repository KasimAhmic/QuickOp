import { Logger } from './logger';
import { Timer } from './timer';

export enum ValidationVerdict {
  FAIL = 'Fail',
  PARTIAL_PASS = 'Partial Pass',
  PASS = 'Pass',
}

export class GcodeValidator {
  private readonly logger: Logger;
  private readonly timer: Timer;

  constructor() {
    this.logger = new Logger(GcodeValidator.name);
    this.timer = new Timer();
  }

  private parseName(methodName: Function) {
    return methodName.name.charAt(0).toUpperCase() + methodName.name.slice(1);
  }

  notationValidation(gcode: string[]): ValidationVerdict {
    let exponentialNotationLines = 0;

    for (let i = 0; i < gcode.length; i++) {
      if (!gcode[i].startsWith(';') && gcode[i].includes('e')) {
        exponentialNotationLines++;
      }
    }

    return exponentialNotationLines === 0 ? ValidationVerdict.PASS : ValidationVerdict.FAIL;
  }

  feedRateValidation(gcode: string[]): ValidationVerdict {
    return ValidationVerdict.PASS;
  }

  validate(gcode: string[]) {
    const validationMethods = [this.notationValidation, this.feedRateValidation];

    for (let i = 0; i < validationMethods.length; i++) {
      try {
        const validation = validationMethods[i];
        const name = this.parseName(validation);

        this.logger.log(`${name} starting...`);

        this.timer.start(name);

        const result = validation.bind(this)(gcode);

        this.timer.end(name);

        switch (result) {
          case ValidationVerdict.FAIL:
            this.logger.error(`${name} failed`);
            break;
          case ValidationVerdict.PARTIAL_PASS:
            this.logger.warn(`${name} passed with warnings`);
            break;
          case ValidationVerdict.PASS:
            this.logger.log(`${name} passed!`);
            break;
        }
      } catch (e) {
        this.logger.error(`An error occurred during '${this.parseName(validationMethods[i])}'`);
        this.logger.error(e);
      }
    }
  }
}
