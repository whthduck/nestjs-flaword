import {
  PipeTransform,
  ArgumentMetadata,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Flaword } from "@whthduck/flaword";
import { Debug } from "@whthduck/flaword/dist/debug";
const debug = Debug("FlawordRequestPipe");

export class FlawordRequestPipe implements PipeTransform<unknown, unknown> {
  _config: { silent?: boolean };
  constructor(config: { silent?: boolean } = {}) {
    this._config = config;
  }
  transform(value, metadata: ArgumentMetadata) {
    const flawordResult = Flaword.check(value);
    if (flawordResult.isFlaw && !this._config.silent) {
      throw new UnprocessableEntityException(
        `${metadata.data || metadata.type} validation failed`
      );
    } else if (flawordResult.key) {
      debug(
        `WARN: This request[${
          metadata.data || metadata.type
        }] validation failed`
      );
    }
    return value;
  }
}
