import { createCanvas, loadImage } from "canvas";
import { randomBytes } from "crypto";
import { load } from "dotenv";
import * as fs from "fs";

export default async function drawPicture(ticker, startDate, endDate, prices) {
  //create canvas
  const canvas = createCanvas(790, 460);
  const ctx = canvas.getContext("2d");

  //draw image
  const backgroundsFolder = "./images/backgrounds";
  const sandFolder = "./images/sand";
  const signFolder = "./images/sign";
  const objectFolder = "./images/objects";
  const eyeFolder = "./images/eyes";
  const whalePath = "./images/whale.png";
  const imageSize = { x: 790, y: 460 };

  //draw background
  const backgroundArray = fs.readdirSync(backgroundsFolder);
  const background = await loadImage(
    `${backgroundsFolder}/${
      backgroundArray[Math.floor(Math.random() * backgroundArray.length)]
    }`
  );
  ctx.drawImage(background, 0, 0, imageSize.x, imageSize.y);

  const sandArray = fs.readdirSync(sandFolder);
  const sand = await loadImage(
    `${sandFolder}/${sandArray[Math.floor(Math.random() * sandArray.length)]}`
  );
  ctx.drawImage(sand, 0, 0, imageSize.x, imageSize.y);

  const signArray = fs.readdirSync(signFolder);
  const sign = await loadImage(
    `${signFolder}/${signArray[Math.floor(Math.random() * signArray.length)]}`
  );
  ctx.drawImage(sign, 0, 0, imageSize.x, imageSize.y);
  //draw graph
  drawGraph(startDate, endDate, prices, ctx);

  //draw whale and objects
  const whale = await loadImage(whalePath);
  /*
  NOISE FILTER
  ctx.drawImage(whale, 0, 0, imageSize.x, imageSize.y);
  let imgData = ctx.getImageData(0, 228, 335, 232);
  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] -= Math.floor(Math.random() * 255);
    imgData.data[i + 1] -= Math.floor(Math.random() * 255);
    imgData.data[i + 2] -= Math.floor(Math.random() * 255);
  }
  ctx.putImageData(imgData, 0, 228);
  */

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

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("./image.png", buffer);
}

function drawGraph(startDate, endDate, prices, ctx) {
  //graph bounds
  const boxX = 376;
  const boxY = 60;
  const boxWidth = 336;
  const boxHeight = 198;

  //graph size
  const graphX = boxX + 50;
  const graphY = 60;
  const graphWidth = boxWidth - 50;
  const graphHeight = 198;

  //bar variables + % change
  const largest = Math.max(...prices);
  const smallest = Math.min(...prices) * 0.85;
  const prices2 = prices
    .map((x) => x - smallest)
    .map((x) => x / (largest - smallest));
  const numberOfBars = prices.length;
  const barWidth = graphWidth / numberOfBars;

  //draw graph
  //ctx.rect(graphX, graphY, graphWidth, graphHeight);
  //ctx.fillStyle = "blue";
  //ctx.fill();
  for (let i = 0; i < numberOfBars; i++) {
    if (i == 0) {
      ctx.fillStyle = "#FFFFFF";
    } else if (i > 0) {
      if (prices2[i] > prices2[i - 1]) {
        ctx.fillStyle = "#2FF541";
      } else {
        ctx.fillStyle = "#F02323";
      }
    }
    const barX =
      graphWidth / 2 - barWidth * (numberOfBars / 2) + graphX + barWidth * i;
    ctx.fillRect(
      barX,
      graphY + graphHeight * (1 - prices2[i]),
      barWidth,
      graphHeight * prices2[i]
    );
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
    ctx.strokeRect(
      barX,
      graphY + graphHeight * (1 - prices2[i]),
      barWidth,
      graphHeight * prices2[i]
    );
  }
  //highest and lowest text
  ctx.fillStyle = "#000000";
  ctx.fillText(largest.toPrecision(7).toString(), boxX + 2.5, boxY + 5);
  ctx.fillText(
    smallest.toPrecision(7).toString(),
    boxX + 2.5,
    boxY + boxHeight - 5
  );
  //draw date
  ctx.save();
  ctx.translate(390, 215);
  ctx.rotate(270 * (Math.PI / 180));
  ctx.font = "10px sans-serif";
  ctx.fillText(`${startDate} --> ${endDate}`, 0, 0);
  ctx.restore();
}
