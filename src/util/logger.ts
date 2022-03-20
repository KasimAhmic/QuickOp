type Message = string | number | boolean;
type TableHeaders = (string | number)[];
type TableRows = (string | number)[][];

interface Colors {
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  reset: string;
}

type Color = keyof Colors;

enum LogLevel {
  DEBUG = 'DEBUG',
  LOG = 'LOG  ',
  WARN = 'WARN ',
  ERROR = 'ERROR',
  NONE = 'NONE ',
}

export class Logger {
  private readonly loggerName: string;
  private readonly colors: Colors;
  private readonly noop = () => {};

  constructor(loggerName: string, disableColors: boolean = false, logLevel: LogLevel = LogLevel.LOG) {
    this.loggerName = loggerName;
    this.colors = {
      black: '\u001b[30m',
      red: '\u001b[31m',
      green: '\u001b[32m',
      yellow: '\u001b[33m',
      blue: '\u001b[34m',
      magenta: '\u001b[35m',
      cyan: '\u001b[36m',
      white: '\u001b[37m',
      reset: '\u001b[0m',
    };

    // Set all the color codes to empty string if disableColors is true
    if (disableColors) {
      Object.keys(this.colors).forEach((color: Color) => (this.colors[color] = ''));
    }

    // Disable the debug method if logLevel is LOG, WARN, ERROR, or NONE
    if ([LogLevel.LOG, LogLevel.WARN, LogLevel.ERROR, LogLevel.NONE].includes(logLevel)) this.debug = this.noop;

    // Disable the log method if logLevel is WARN, ERROR, or NONE
    if ([LogLevel.WARN, LogLevel.ERROR, LogLevel.NONE].includes(logLevel)) this.log = this.noop;

    // Disable the warn method if logLevel is ERROR, or NONE
    if ([LogLevel.ERROR, LogLevel.NONE].includes(logLevel)) this.warn = this.noop;

    // Disable the error method if logLevel is NONE
    if ([LogLevel.NONE].includes(logLevel)) this.error = this.noop;
  }

  /**
   * @description Writes a DEBUG level message to the console.
   * @param msg Message to write
   */
  debug(msg: Message) {
    this.write(LogLevel.DEBUG, msg, 'cyan');
  }

  /**
   * @description Writes a LOG level message to the console.
   * @param msg Message to write
   */
  log(msg: Message) {
    this.write(LogLevel.LOG, msg, 'green');
  }

  /**
   * @description Writes a WARN level message to the console.
   * @param msg Message to write
   */
  warn(msg: Message) {
    this.write(LogLevel.WARN, msg, 'yellow');
  }

  /**
   * @description Writes a ERROR level message to the console.
   * @param msg Message to write
   */
  error(msg: Message) {
    this.write(LogLevel.ERROR, msg, 'red');
  }

  /**
   * @description Writes ta table to the console.
   * @param tableHeaders
   * @param tableRows
   */
  table(tableHeaders: TableHeaders, ...tableRows: TableRows) {
    const headerSizes = tableHeaders.map((header) => header.toString().length);
    let cellSizes: number[] = [];

    tableRows.forEach((row) => (cellSizes = cellSizes.concat(row.map((cell) => cell.toString().length))));

    const columnSize = Math.max(...headerSizes, ...cellSizes);

    const tableBorder = tableHeaders.map(() => '-'.repeat(columnSize + 2)).join(' ');
    const headerSeparator = tableHeaders.map(() => '-'.repeat(columnSize)).join(' | ');

    const header = `${tableHeaders.map((header) => header.toString().padEnd(columnSize)).join(' | ')}`;
    const rows = tableRows.map((row) => row.map((cell) => cell.toString().padEnd(columnSize)).join(' | '));

    this.log(` ${tableBorder} `);
    this.log(`| ${header} |`);
    this.log(`| ${headerSeparator} |`);

    for (const row of rows) {
      this.log(`| ${row} |`);
    }

    this.log(` ${tableBorder} `);
  }

  /**
   * @description Writes a message to the console with the app name, date/time, log level, and logger name.
   * @param logLevel
   * @param msg
   * @param color
   */
  private write(logLevel: LogLevel, msg: Message, color: Color) {
    // Application name
    const quickOp = `${this.colors[color]}[QuickOp]${this.colors.reset}`;

    // Current date and time
    const date = Logger.getFormattedDate();

    // Log level
    const level = `${this.colors[color]}[ ${logLevel} ]${this.colors.reset}`;

    // Name of the Operation class that called the logger
    const loggerName = `${this.colors.yellow}[${this.loggerName}]${this.colors.reset}`;

    // Message to log
    const message = `${this.colors[color]}${msg}${this.colors.reset}`;

    process.stdout.write(`${quickOp} ${date} ${level} ${loggerName} - ${message}\n`);
  }

  /**
   * @description Returns a formatted date and time (M/DD/YYYY, H:MM:SS AM/PM) similar to `new Date().toLocaleString()` but 7 times faster.
   */
  private static getFormattedDate() {
    const date = new Date();

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    const currentHour = date.getHours();

    const hour = currentHour <= 12 ? currentHour : currentHour % 12;
    const minute = Logger.padStart(`${date.getMinutes()}`);
    const second = Logger.padStart(`${date.getSeconds()}`);

    const ampm = currentHour < 12 ? 'AM' : 'PM';

    return `${month}/${day}/${year}, ${hour}:${minute}:${second} ${ampm}`;
  }

  /**
   * @description Adds a 0 to the front of the string if the length is less than two. Faster than `String.padStart()`.
   * @param value
   */
  private static padStart(value: string) {
    return value.length < 2 ? '0' + value : value;
  }
}

const logger = new Logger('test');

logger.log('teset');
