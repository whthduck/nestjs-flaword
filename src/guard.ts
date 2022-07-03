import { Request, Response } from "express";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Flaword, FlawordOptions as Options } from "@whthduck/flaword";
import { Debug } from "@whthduck/flaword/dist/debug";
import { Observable } from "rxjs";
const debug = Debug("FlawordGuard");

const FlawordOptionsPropertyName = Symbol("FlawordOptionsPropertyName");

export class FlawordOptions extends Options {
  isOverwrite: boolean;
  constructor(opts: Partial<FlawordOptions> = {}) {
    super(opts);
    this.isOverwrite =
      typeof opts.isOverwrite === "boolean" ? opts.isOverwrite : false;
  }
}

export function FlawordGuardOptions(
  options?: Partial<FlawordOptions>
): ClassDecorator & MethodDecorator {
  return function (target) {
    const descriptor: PropertyDescriptor = arguments[2];
    const metaType = descriptor ? "method" : "class";
    switch (metaType) {
      case "class":
        Reflect.defineMetadata(FlawordOptionsPropertyName, options, target);
        break;

      default:
        Reflect.defineMetadata(
          FlawordOptionsPropertyName,
          options,
          descriptor.value
        );
        break;
    }
  };
}

@Injectable()
export class FlawordGuard implements CanActivate {
  private globalOptions: FlawordOptions;
  constructor(opts: Partial<Options> = {}) {
    this.globalOptions = new FlawordOptions(opts);
  }

  getOptions(
    globalOpts: FlawordOptions,
    classOpts: FlawordOptions,
    methodOpts: FlawordOptions
  ) {
    let options = new FlawordOptions();

    options.isEmpty = methodOpts.isEmpty;
    if (methodOpts.isOverwrite) {
      options.blacklist = methodOpts.blacklist;
      options.whitelist = methodOpts.whitelist;
      return options;
    }

    options.isEmpty = classOpts.isEmpty;
    if (classOpts.isOverwrite) {
      options.blacklist = [].concat(
        methodOpts.blacklist as [],
        classOpts.blacklist as []
      );
      options.whitelist = [].concat(
        methodOpts.whitelist as [],
        classOpts.whitelist as []
      );
      return options;
    }

    options.isEmpty = globalOpts.isEmpty;
    options.blacklist = [].concat(
      methodOpts.blacklist as [],
      classOpts.blacklist as [],
      globalOpts.blacklist as []
    );
    options.whitelist = [].concat(
      methodOpts.whitelist as [],
      classOpts.whitelist as [],
      globalOpts.whitelist as []
    );
    return options;
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const globalOptions = this.globalOptions;
    const classOptions: FlawordOptions = Reflect.getMetadata(
      FlawordOptionsPropertyName,
      context.getClass()
    );
    const methodOptions: FlawordOptions = Reflect.getMetadata(
      FlawordOptionsPropertyName,
      context.getHandler()
    );
    const options = this.getOptions(
      new FlawordOptions(globalOptions),
      new FlawordOptions(classOptions),
      new FlawordOptions(methodOptions)
    );

    if (req.query) {
      const flawordResult = Flaword.check(req.query, options);
      if (flawordResult.isFlaw) {
        throw new UnprocessableEntityException(
          `${flawordResult.key} validation failed`
        );
      }
    }

    return true;
  }
}
