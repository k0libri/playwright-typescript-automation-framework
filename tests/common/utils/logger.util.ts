/**
 * Logger Utility
 * Centralized logging for the test framework
 * Supports different log levels and can be controlled via DEBUG_LOGGING in .env
 */
export class Logger {
  private static isDebugEnabled = process.env['DEBUG_LOGGING'] === 'true';

  /**
   * Log informational messages (only when DEBUG_LOGGING=true)
   * @param message - The informational message to log
   * @param data - Optional additional data to include in the log
   * @returns void
   */
  static info(message: string, data?: unknown): void {
    if (this.isDebugEnabled) {
      console.info('[INFO]', message, data ?? '');
    }
  }

  /**
   * Log error messages (always logged)
   * @param message - The error message to log
   * @param data - Optional error data or stack trace to include
   * @returns void
   */
  static error(message: string, data?: unknown): void {
    console.error('[ERROR]', message, data ?? '');
  }

  /**
   * Log warning messages (only when DEBUG_LOGGING=true)
   * @param message - The warning message to log
   * @param data - Optional additional data to include
   * @returns void
   */
  static warn(message: string, data?: unknown): void {
    if (this.isDebugEnabled) {
      console.warn('[WARN]', message, data ?? '');
    }
  }

  /**
   * Log debug messages (only when DEBUG_LOGGING=true)
   * @param message - The debug message to log
   * @param data - Optional debug data to include
   * @returns void
   */
  static debug(message: string, data?: unknown): void {
    if (this.isDebugEnabled) {
      console.debug('[DEBUG]', message, data ?? '');
    }
  }

  /**
   * Log test step information (only when DEBUG_LOGGING=true)
   * @param message - The test step description to log
   * @returns void
   */
  static step(message: string): void {
    if (this.isDebugEnabled) {
      console.log('[STEP]', message);
    }
  }
}
