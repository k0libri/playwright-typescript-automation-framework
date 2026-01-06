/**
 * Logger Utility
 * Centralized logging for the test framework
 * Supports different log levels and can be controlled via DEBUG_LOGGING in .env
 */
export class Logger {
  private static isDebugEnabled = process.env['DEBUG_LOGGING'] === 'true';

  /**
   * Log informational messages (only when DEBUG_LOGGING=true)
   */
  static info(message: string, data?: unknown): void {
    if (this.isDebugEnabled) {
      console.info('[INFO]', message, data ?? '');
    }
  }

  /**
   * Log error messages (always logged)
   */
  static error(message: string, data?: unknown): void {
    console.error('[ERROR]', message, data ?? '');
  }

  /**
   * Log warning messages (only when DEBUG_LOGGING=true)
   */
  static warn(message: string, data?: unknown): void {
    if (this.isDebugEnabled) {
      console.warn('[WARN]', message, data ?? '');
    }
  }

  /**
   * Log debug messages (only when DEBUG_LOGGING=true)
   */
  static debug(message: string, data?: unknown): void {
    if (this.isDebugEnabled) {
      console.debug('[DEBUG]', message, data ?? '');
    }
  }

  /**
   * Log test step information (only when DEBUG_LOGGING=true)
   */
  static step(message: string): void {
    if (this.isDebugEnabled) {
      console.log('[STEP]', message);
    }
  }
}
