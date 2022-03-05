export class TimeUtil {
  private readonly milliseconds: number;

  static readonly MILLISECONDS_IN_SECOND = 1000;
  static readonly SECONDS_IN_MINUTE = 60;
  static readonly MINUTES_IN_HOUR = 60;
  static readonly HOURS_IN_DAY = 24;
  static readonly DAYS_IN_WEEK = 7;
  static readonly DAYS_IN_YEAR = 365;
  static readonly WEEKS_IN_YEAR = 52;
  static readonly MONTHS_IN_YEAR = 12;

  static readonly MILLISECONDS_IN_MINUTE = TimeUtil.MILLISECONDS_IN_SECOND * TimeUtil.SECONDS_IN_MINUTE;

  static readonly MILLISECONDS_IN_HOUR =
    TimeUtil.MILLISECONDS_IN_SECOND * TimeUtil.SECONDS_IN_MINUTE * TimeUtil.MINUTES_IN_HOUR;

  static readonly MILLISECONDS_IN_DAY =
    TimeUtil.MILLISECONDS_IN_SECOND *
    TimeUtil.SECONDS_IN_MINUTE *
    TimeUtil.MINUTES_IN_HOUR *
    TimeUtil.HOURS_IN_DAY;

  static readonly MILLISECONDS_IN_WEEK =
    TimeUtil.MILLISECONDS_IN_SECOND *
    TimeUtil.SECONDS_IN_MINUTE *
    TimeUtil.MINUTES_IN_HOUR *
    TimeUtil.HOURS_IN_DAY *
    TimeUtil.DAYS_IN_WEEK;

  static readonly MILLISECONDS_IN_YEAR =
    TimeUtil.MILLISECONDS_IN_SECOND *
    TimeUtil.SECONDS_IN_MINUTE *
    TimeUtil.MINUTES_IN_HOUR *
    TimeUtil.HOURS_IN_DAY *
    TimeUtil.DAYS_IN_YEAR;

  static readonly ESTIMATED_MILLISECONDS_IN_MONTH = TimeUtil.MILLISECONDS_IN_YEAR / TimeUtil.MONTHS_IN_YEAR;

  constructor(milliseconds: number) {
    this.milliseconds = milliseconds;
  }

  /**
   * @description Returns a new TimeUtil object containing the passed number of milliseconds.
   * @param milliseconds Number of milliseconds
   */
  static milliseconds(milliseconds: number): TimeUtil {
    return new this(milliseconds);
  }

  /**
   * @description Returns a new TimeUtil object containing the passed number of seconds in milliseconds.
   * @param seconds Number of seconds
   */
  static seconds(seconds: number): TimeUtil {
    return new this(seconds * TimeUtil.MILLISECONDS_IN_SECOND);
  }

  /**
   * @description Returns a new TimeUtil object containing the passed number of minutes in milliseconds.
   * @param minutes Number of minutes
   */
  static minutes(minutes: number): TimeUtil {
    return new this(minutes * TimeUtil.MILLISECONDS_IN_MINUTE);
  }

  /**
   * @description Returns a new TimeUtil object containing the passed number of hours in milliseconds.
   * @param hours Number of hours
   */
  static hours(hours: number): TimeUtil {
    return new this(hours * TimeUtil.MILLISECONDS_IN_HOUR);
  }

  /**
   * @description Returns a new TimeUtil object containing the passed number of days in milliseconds.
   * @param days Number of days
   */
  static days(days: number): TimeUtil {
    return new this(days * TimeUtil.MILLISECONDS_IN_DAY);
  }

  /**
   * @description Returns a new TimeUtil object containing the passed number of weeks in milliseconds.
   * @param weeks Number of weeks
   */
  static weeks(weeks: number): TimeUtil {
    return new this(weeks * TimeUtil.MILLISECONDS_IN_WEEK);
  }

  /**
   * @deprecated **This value is estimated and not recommended where precision is needed.**
   *
   * @description Returns a new TimeUtil object containing the passed number of months in milliseconds.
   * @param months Number of months
   *
   */
  static months(months: number): TimeUtil {
    return new this(months * TimeUtil.ESTIMATED_MILLISECONDS_IN_MONTH);
  }

  /**
   * @description Returns a new TimeUtil object containing the passed number of years in milliseconds.
   * @param years Number of years
   */
  static years(years: number): TimeUtil {
    return new this(years * TimeUtil.MILLISECONDS_IN_YEAR);
  }

  /**
   * @description Converts milliseconds to milliseconds.
   */
  toMilliseconds(): number {
    return this.milliseconds;
  }

  /**
   * @description Converts milliseconds to seconds.
   */
  toSeconds(): number {
    return this.milliseconds / TimeUtil.MILLISECONDS_IN_SECOND;
  }

  /**
   * @description Converts milliseconds to minutes.
   */
  toMinutes(): number {
    return this.milliseconds / TimeUtil.MILLISECONDS_IN_MINUTE;
  }

  /**
   * @description Converts milliseconds to hours.
   */
  toHours(): number {
    return this.milliseconds / TimeUtil.MILLISECONDS_IN_HOUR;
  }

  /**
   * @description Converts milliseconds to days.
   */
  toDays(): number {
    return this.milliseconds / TimeUtil.MILLISECONDS_IN_DAY;
  }

  /**
   * @description Converts milliseconds to weeks.
   */
  toWeeks(): number {
    return this.milliseconds / TimeUtil.MILLISECONDS_IN_WEEK;
  }

  /**
   * @deprecated **This value is estimated and not recommended where precision is needed.**
   *
   * @description Converts milliseconds to months.
   */
  toMonths(): number {
    return this.milliseconds / TimeUtil.ESTIMATED_MILLISECONDS_IN_MONTH;
  }

  /**
   * @description Converts milliseconds to years.
   */
  toYears(): number {
    return this.milliseconds / TimeUtil.MILLISECONDS_IN_YEAR;
  }
}
