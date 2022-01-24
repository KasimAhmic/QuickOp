export type LogLevel = 'DEBUG' | 'LOG' | 'WARN' | 'ERROR';
export type Message = string | number | boolean;
export type TableHeaders = (string | number)[];
export type TableRow = (string | number)[][];

export interface Colors {
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

export type Color = keyof Colors;

export class Logger {
  private readonly logerName: string;
  private readonly colors: Colors;

  constructor(logerName: string, disableColors: boolean = false) {
    this.logerName = logerName;
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
  }

  private write(logLevel: LogLevel, msg: Message, color: Color) {
    const quickOp = `${this.colors.green}[QuickOp]${this.colors.reset}`;
    const date = new Date().toLocaleString();
    const level = `${this.colors[color]}[ ${logLevel.padEnd(5)} ]${this.colors.reset}`;
    const loggerName = `${this.colors.yellow}[${this.logerName}]${this.colors.reset}`;
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

  table(tableHeaders: TableHeaders, ...tableRows: TableRow) {
    const headerSizes = tableHeaders.map((header) => header.toString().length);
    let cellSizes: number[] = [];

    tableRows.forEach((row) => (cellSizes = cellSizes.concat(row.map((cell) => cell.toString().length))));

    const columnSize = Math.max(...headerSizes, ...cellSizes);

    const tableBorder = tableHeaders.map(() => '-'.repeat(columnSize + 2)).join(' ');
    const headerSeparator = tableHeaders.map(() => '-'.repeat(columnSize)).join(' | ');

    const header = `${tableHeaders.map((header) => header.toString().padEnd(columnSize)).join(' | ')}`;
    const rows = tableRows.map((row) => row.map((cell) => cell.toString().padEnd(columnSize)).join(' | '));

    this.write('LOG', ` ${tableBorder} `, 'green');
    this.write('LOG', `| ${header} |`, 'green');
    this.write('LOG', `| ${headerSeparator} |`, 'green');

    for (const row of rows) {
      this.write('LOG', `| ${row} |`, 'green');
    }

    this.write('LOG', ` ${tableBorder} `, 'green');
  }
}
