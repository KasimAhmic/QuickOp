<div align="center">
  <img src="./quick-op.svg" width="650" height="auto" />
</div>

<div align="center">

[![License: AGPL-3.0](https://img.shields.io/github/license/KasimAhmic/QuickOp)](https://github.com/KasimAhmic/QuickOp/blob/main/LICENSE)
[![QuickOp Issues](https://img.shields.io/github/issues/KasimAhmic/QuickOp)](https://github.com/KasimAhmic/QuickOp/issues)
[![QuickOp Pull Requests](https://img.shields.io/github/issues-pr/KasimAhmic/QuickOp)](https://github.com/KasimAhmic/QuickOp/pulls)
[![QuickOp Commit Activity](https://img.shields.io/github/commit-activity/w/KasimAhmic/QuickOp)](https://github.com/KasimAhmic/QuickOp/commits/main)
<br />
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Speed: Blazing](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg)](https://twitter.com/acdlite/status/974390255393505280)

</div>

---

QuickOp is a simple to use utility for generating GCODE for simple, one-off CNC machining operations.

Frequently, you may need to do a facing or drilling operating but doing so in something like Fusion 360 requires modeling the stock in addition to the standard CAM dance. QuickOp aims to provide a single interface where you add your particular values (width of cut, depth of cut, tool diameter, etc) and it generates simplistic GCODE for you without you ever needing to touch proper CAD/CAM software!

## Requirements

- [Node.js >= 16.0.0](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) - Probably better that you install by running `npm i -g yarn`

## Installation

Run the commands below in order.

```bash
git clone https://github.com/KasimAhmic/QuickOp.git
cd QuickOp
yarn
```

## Running

QuickOp is still a WIP and as such the methods for running the operation generators will change drastically over time. At present, the only two generators that can be run are Facing and Spiral Facing. You can run them by tweaking the parameters in the `src/operations/facing.ts` and `src/operations/spiral-facing.ts` files respectively and then running the commands below for the operation you want.

```bash
yarn facing
yarn spiral-facing
```

In the near future, I hope to make a simple CLI script that will read a config file and run the operations for you. In the farther future, I will be making a UI where you can key in the data and MAYBE even have a GCODE preview. Only time will tell.

## Contributing

Code quality and code formatting are taken very seriously. Prettier is used to format all the code in the project before each commit and I highly suggest you configure your editor to auto format on save. The `.vscode` folder contains some general settings that _should_ do this for you if you're running VS Code. The project is also configured to use Conventional Commits and Commit Lint to format all commit messages.

Some rules of thumb when contributing:

- Use thoughtful variable names
  - `woc` - Don't abbreviate where not absolutely needed. `widthOfCut` makes it more apparent to everyone what information this variable contains.
  - `widthOfCutWhenConventionalCutting` - Avoid "conditionals" in variable names. `conventionalWidthOfCut` would be better.
- Use line breaks to keep code clean. Use your judgment here as it's hard to quantify when you should use line breaks and when they're not needed. Similar calculations/operations could probably do without any line breaks between them but if you go from calculating the position of X and Y to adding a command, there should probably be a line break. In the code below, notice how `sineOfAngle` and `cosineOfAngle` have no line breaks between them but there are line breaks between them and setting the `xPosition` and `yPosition`.

```typescript
const angle = new Decimal(i).mul(Math.PI).div(180);

const sineOfAngle = new Decimal(angle).sin().toFixed(this.calculationPrecision);
const cosineOfAngle = new Decimal(angle).cos().toFixed(this.calculationPrecision);

this.xPosition = new Decimal(this.widthOfCut)
  .div(Math.PI * 2)
  .mul(angle)
  .mul(sineOfAngle);

this.yPosition = new Decimal(this.widthOfCut)
  .div(Math.PI * 2)
  .mul(angle)
  .mul(cosineOfAngle);

this.addCommand(G0, X(), Y(), F(this.cuttingFeedRate));
```

- Format your commit messages to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) standard. This is enforced via Husky and Commit Lint.
  - Format: `[type]: [message]`
  - The `type` should be lowercase and should be one of `fix`, `feat`, `docs`, `style`, `perf`, `test`, or `chore`
  - The `message` should be in sentence case which means the first character should be uppercase. (e.x. `Added SpiralFacing class to operations`)
  - Full example: `chore: Updated README with more details about the project`

Happy Milling!
