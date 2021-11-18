import { createCanvas, loadImage } from "canvas";
import * as fs from "fs";
import drawGraph from "./drawGraph";
import { Z_ASCII } from "zlib";

//create canvas
const canvas = createCanvas(790, 460);
const ctx = canvas.getContext("2d");
const imageSize = { x: 790, y: 460 };

export default async function drawPicture(
  ticker,
  startDate,
  endDate,
  prices,
  firstPrice
) {
  //draw image
  const background = await drawBackground(); //includes background, sand, & sign
  const graph = await drawGraph(startDate, endDate, prices, firstPrice, ctx); //graph is overlay on sign
  const objects = await drawObjects();
  const character = await drawCharacter(); //only whale at the moment

  //draw ticker
  ctx.save();
  ctx.font = "40px sans-serif";
  ctx.translate(260, 415);
  ctx.rotate(350 * (Math.PI / 180));
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(ticker, 0, 0);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#000000";
  ctx.strokeText(ticker, 0, 0);
  ctx.restore();

  //draw price
  ctx.save();
  ctx.translate(320, 435);
  ctx.rotate(2.5 * (Math.PI / 180));
  ctx.font = "40px sans-serif";

  let change = 0;
  let operator = "+";
  const firstDay = prices[0];
  const lastDay = prices[prices.length - 1];
  if (firstDay < lastDay) {
    change = ((lastDay - firstDay) / firstDay) * 100;
    ctx.fillStyle = "#00FF00";
  } else if (lastDay < firstDay) {
    change = ((firstDay - lastDay) / firstDay) * 100;
    operator = "-";
    ctx.fillStyle = "#FF0000";
  } else {
    change = 0;
    ctx.fillStyle = "#00FF00";
  }
  const result = change.toFixed(1);
  ctx.fillText(`${operator}${result}%`, 0, 0);
  ctx.restore();

  //draw border
  ctx.lineWidth = 4;
  ctx.strokeStyle =
    "#" +
    Math.floor(Math.random() * 255).toString(16) +
    Math.floor(Math.random() * 255).toString(16) +
    Math.floor(Math.random() * 255).toString(16);
  ctx.strokeRect(2, 2, 790 - 4, 460 - 4);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("./image.png", buffer);
}

async function drawBackground() {
  const backgroundsFolder = "./images/backgrounds";
  const backgroundArray = fs.readdirSync(backgroundsFolder);
  const background = await loadImage(
    `${backgroundsFolder}/${
      backgroundArray[Math.floor(Math.random() * backgroundArray.length)]
    }`
  );
  ctx.drawImage(background, 0, 0, imageSize.x, imageSize.y);

  const sandFolder = "./images/sand";
  const sandArray = fs.readdirSync(sandFolder);
  const sand = await loadImage(
    `${sandFolder}/${sandArray[Math.floor(Math.random() * sandArray.length)]}`
  );
  ctx.drawImage(sand, 0, 0, imageSize.x, imageSize.y);

  const signFolder = "./images/sign";
  const signArray = fs.readdirSync(signFolder);
  const sign = await loadImage(
    `${signFolder}/${signArray[Math.floor(Math.random() * signArray.length)]}`
  );
  ctx.drawImage(sign, 0, 0, imageSize.x, imageSize.y);
}

async function drawCharacter() {
  const skinFolder = "./images/skin";
  const eyeFolder = "./images/eyes";

  const skinArray = fs.readdirSync(skinFolder);
  const skin =
    Math.random() * 100 <= 1
      ? await loadImage("./images/rare/greenGoblin.png")
      : await loadImage(
          `${skinFolder}/${
            skinArray[Math.floor(Math.random() * skinArray.length)]
          }`
        );
  ctx.drawImage(skin, 0, 0, imageSize.x, imageSize.y);

  const eyeArray = fs.readdirSync(eyeFolder).sort();
  const eye = await loadImage(
    `${eyeFolder}/${eyeArray[Math.floor(Math.random() * eyeArray.length)]}`
  );
  ctx.drawImage(eye, 0, 0, imageSize.x, imageSize.y);
}

async function drawObjects() {
  const objectFolder = "./images/objects";
  const objectArray = fs.readdirSync(objectFolder);
  for (let i = 0; i < objectArray.length; i++) {
    if (Math.random() > 0.5) {
      let image = await loadImage(`${objectFolder}/${objectArray[i]}`);
      ctx.drawImage(image, 0, 0, imageSize.x, imageSize.y);
    }
  }
}
