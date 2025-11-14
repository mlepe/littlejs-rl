/*
 * File: errors.ts
 * Project: littlejs-rl
 * File Created: November 14, 2025
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: November 14, 2025
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

/**
 * Base class for data loading errors
 */
export class DataLoadError extends Error {
  constructor(
    message: string,
    public readonly filePath?: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'DataLoadError';
    Object.setPrototypeOf(this, DataLoadError.prototype);
  }

  toString(): string {
    let result = `${this.name}: ${this.message}`;
    if (this.filePath) {
      result += `\n  File: ${this.filePath}`;
    }
    if (this.details) {
      result += `\n  Details: ${JSON.stringify(this.details, null, 2)}`;
    }
    return result;
  }
}

/**
 * Error thrown when data validation fails
 */
export class ValidationError extends DataLoadError {
  constructor(
    message: string,
    public readonly errors: string[],
    public readonly warnings: string[],
    filePath?: string
  ) {
    super(message, filePath, { errors, warnings });
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  toString(): string {
    let result = `${this.name}: ${this.message}`;
    if (this.filePath) {
      result += `\n  File: ${this.filePath}`;
    }
    if (this.errors.length > 0) {
      result += `\n  Errors:`;
      for (const error of this.errors) {
        result += `\n    - ${error}`;
      }
    }
    if (this.warnings.length > 0) {
      result += `\n  Warnings:`;
      for (const warning of this.warnings) {
        result += `\n    - ${warning}`;
      }
    }
    return result;
  }
}

/**
 * Error thrown when required data is missing
 */
export class MissingDataError extends DataLoadError {
  constructor(
    public readonly dataType: string,
    public readonly dataId: string,
    details?: any
  ) {
    super(`Missing ${dataType} data: '${dataId}'`, undefined, details);
    this.name = 'MissingDataError';
    Object.setPrototypeOf(this, MissingDataError.prototype);
  }
}

/**
 * Error thrown when a file cannot be loaded
 */
export class FileLoadError extends DataLoadError {
  constructor(
    filePath: string,
    public readonly statusCode?: number,
    public readonly originalError?: Error
  ) {
    super(
      `Failed to load file: ${filePath}${statusCode ? ` (HTTP ${statusCode})` : ''}`,
      filePath,
      originalError
    );
    this.name = 'FileLoadError';
    Object.setPrototypeOf(this, FileLoadError.prototype);
  }
}

/**
 * Error thrown when JSON parsing fails
 */
export class ParseError extends DataLoadError {
  constructor(
    filePath: string,
    public readonly originalError: Error
  ) {
    super(
      `Failed to parse JSON in file: ${filePath}`,
      filePath,
      originalError.message
    );
    this.name = 'ParseError';
    Object.setPrototypeOf(this, ParseError.prototype);
  }
}

/**
 * Logs an error with consistent formatting
 */
export function logError(error: Error, context?: string): void {
  console.error(`\n========================================`);
  console.error(`ERROR${context ? ` [${context}]` : ''}`);
  console.error(`========================================`);
  if (error instanceof DataLoadError) {
    console.error(error.toString());
  } else {
    console.error(`${error.name}: ${error.message}`);
    if (error.stack) {
      console.error(`Stack:\n${error.stack}`);
    }
  }
  console.error(`========================================\n`);
}

/**
 * Logs warnings with consistent formatting
 */
export function logWarnings(warnings: string[], context?: string): void {
  if (warnings.length === 0) return;

  console.warn(`\n----------------------------------------`);
  console.warn(`WARNINGS${context ? ` [${context}]` : ''}`);
  console.warn(`----------------------------------------`);
  for (const warning of warnings) {
    console.warn(`  - ${warning}`);
  }
  console.warn(`----------------------------------------\n`);
}

/**
 * Logs validation results
 */
export function logValidationResult(
  result: { errors: string[]; warnings: string[] },
  context: string
): void {
  if (result.errors.length > 0) {
    console.error(`\nValidation Errors [${context}]:`);
    for (const error of result.errors) {
      console.error(`  ❌ ${error}`);
    }
  }

  if (result.warnings.length > 0) {
    console.warn(`\nValidation Warnings [${context}]:`);
    for (const warning of result.warnings) {
      console.warn(`  ⚠️  ${warning}`);
    }
  }
}
