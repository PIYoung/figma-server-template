import { getResponsePhrase } from '../utils';

export class HttpError extends Error {
  constructor(
    readonly statusCode: number,
    readonly customMessage?: string,
  ) {
    const message = customMessage ?? getResponsePhrase(statusCode);

    super(message);

    this.name = HttpError.name;
    this.message = message;
  }
}
