# nestjs-flaword
A Nest Module validate and prevent request which like a SQL injection, NoSQL injection, Javascript injection.

## Why must there be
Most hackers love to take control of the system; the most common way is injecting malicious code into the input. The software reads data and executes malicious code, so they create vulnerabilities that allow hackers to gain control.

The company's project entered the security testing phase, the team chose the direction of SAST and DAST reporting. SAST uses SonarCloud with integrated CICD to analyze the source code every time it is released. DAST uses StackHawk to scan all available APIs.

StackHawk reports many High-Risk errors in NoSQL injection, SQL injection, and server-side template injection. To address these vulnerabilities, the team created a Guard Module to detect, prevent, and report API requests which contain malicious code.

After a few days of searching on Npmjs and GitHub, I couldn't find a suitable library for Nodejs and Mongodb, so I researched, and published the Flaword library to the community.

## Installation
Installation is done using the [npm install command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):
```bash
npm install @whthduck/nestjs-flaword
```

Or using the [yarn add command](https://yarnpkg.com/cli/add)
```bash
yarn add @whthduck/nestjs-flaword
```

## Quick start
The quickest way is started with [Nestjs](https://docs.nestjs.com/) . If you haven't seen let's follow  [installing guide ](https://docs.nestjs.com/)
After that, use Guards like the source code below or follow the [example](https://github.com/whthduck/nestjs-flaword/tree/main/example)
``` javascript
 const app = await NestFactory.create(AppModule);
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));
  app.useGlobalGuards(new FlawordGuard())
  await app.listen(process.env.APP_PORT || 3000);
```

## TODO
✅ Implement [flaword](https://github.com/whthduck/flaword) library
✅ Implement [nestjs-flaword](https://github.com/whthduck/nestjs-flaword) module
✅ Detect basic injection (NoSQL, SQL, javascript, shell)
✅ Prevent
✔️ Report
✔️ Reduce detection timing
✔️ HTML keywords 

## Thank you
- [SecList](https://github.com/danielmiessler/SecLists/tree/master)  List types include usernames, passwords, URLs, sensitive data patterns, fuzzing payloads, web shells, and many more.
- [HackTricks](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection/el-expression-language) the page where you will find each hacking trick/technique/whatever I have learnt in CTFs, real life apps, and reading researches and news.
- [node-esapi](https://www.npmjs.com/package/node-esapi) - node-esapi is a minimal port of the ESAPI4JS (Enterprise Security API for JavaScript) encoder.

## License
[MIT](https://github.com/whthduck/nestjs-flaword/blob/main/LICENSE)