type LogLevel = 'DEBUG' | 'LOG' | 'WARN' | 'ERROR' | 'NONE';
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

export class Logger {
  private readonly loggerName: string;
  private readonly colors: Colors;
  private readonly noop = () => {};

  constructor(loggerName: string, disableColors: boolean = false, logLevel: LogLevel = 'LOG') {
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

    if (disableColors) {
      Object.keys(this.colors).forEach((color: Color) => (this.colors[color] = ''));
    }

    if (['LOG', 'WARN', 'ERROR', 'NONE'].includes(logLevel)) this.debug = this.noop;
    if (['WARN', 'ERROR', 'NONE'].includes(logLevel)) this.log = this.noop;
    if (['ERROR', 'NONE'].includes(logLevel)) this.warn = this.noop;
    if (['NONE'].includes(logLevel)) this.error = this.noop;
  }

  private write(logLevel: LogLevel, msg: Message, color: Color) {
    // Application name
    const quickOp = `${this.colors[color]}[QuickOp]${this.colors.reset}`;

    // Current date and time
    const date = new Date().toLocaleString();

    // Log level
    const level = `${this.colors[color]}[ ${logLevel.padEnd(5)} ]${this.colors.reset}`;

    // Name of the Operation class that called the logger
    const loggerName = `${this.colors.yellow}[${this.loggerName}]${this.colors.reset}`;

    // Message to log
    const message = `${this.colors[color]}${msg}${this.colors.reset}`;

    process.stdout.write(`${quickOp} ${date} ${level} ${loggerName} - ${message}\n`);
  }

  debug(msg: Message) {
    this.write('DEBUG', msg, 'cyan');
  }

  log(msg: Message) {
    this.write('LOG', msg, 'green');
  }

  warn(msg: Message) {
    this.write('WARN', msg, 'yellow');
  }

  error(msg: Message) {
    this.write('ERROR', msg, 'red');
  }

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
}
