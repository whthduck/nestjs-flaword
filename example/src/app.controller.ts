import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { FlawordGuardOptions } from "../../dist";

@FlawordGuardOptions({ blacklist: ["controller"] })
@Controller()
export class AppController {
  constructor() {}

  // TEST: backlist: [controller]
  @Get()
  async get(@Query() query) {
    return query;
  }

  // TEST: backlist: [controller] & ["get2"]
  @FlawordGuardOptions({ blacklist: ["get2"] })
  @Get("get1")
  async get1(@Query() query) {
    return query;
  }

  // TEST: only backlist: ["get1"]
  @FlawordGuardOptions({ blacklist: ["get1"], isOverwrite: true })
  @Get("get2")
  async get2(@Query() query) {
    return query;
  }

  // TEST: don't care controller backlist: [controller]
  @FlawordGuardOptions({ isOverwrite: true })
  @Get("get3")
  async get3(@Query() query) {
    return query;
  }
}
