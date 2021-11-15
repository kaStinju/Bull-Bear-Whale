import axios from "axios";
import { createCanvas, loadImage } from "canvas";
import * as fs from "fs";
import * as dotenv from "dotenv";

async function run() {
  dotenv.config();

  const ticker = "LRC";

  const currency = "USD";
  const from = "2021-11-06";
  const to = "2021-11-13";
  const key_covalent = process.env.API_KEY_COVALENT;
  const res = await axios.get(
    `https://api.covalenthq.com/v1/pricing/historical/USD/${ticker}/`,
    {
      params: {
        "quote-currency": currency,
        format: "json",
        from: from,
        to: to,
        key: key_covalent,
      },
    }
  );
  const prices = res.data.data.prices.map(({ price }) => price);
  console.log(prices);

  drawPicture(prices);
}

async function drawPicture(arr) {
  const boxX = 376;
  const boxY = 60;
  const boxWidth = 336;
  const boxHeight = 198;

  const graphX = boxX + 20;
  const graphY = 60;
  const graphWidth = boxWidth - 40;
  const graphHeight = 198;

  const largest = Math.max(...arr);
  const smallest = Math.min(...arr) * 0.995;
  const arr2 = arr
    .map((x) => x - smallest)
    .map((x) => x / (largest - smallest));
  const numberOfBars = arr.length;
  const barWidth = graphWidth / numberOfBars;

  console.log(arr2);
  const overlay = await loadImage("./test.png");
  const canvas = createCanvas(790, 460);
  const ctx = canvas.getContext("2d");
  ctx.rect(graphX, graphY, graphWidth, graphHeight);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.fillStyle = "red";
  for (let i = 0; i < numberOfBars; i++) {
    const barX =
      graphWidth / 2 - barWidth * (numberOfBars / 2) + graphX + barWidth * i;
    ctx.fillRect(
      barX,
      graphY + graphHeight * (1 - arr2[i]),
      barWidth,
      graphHeight * arr2[i]
    );
    console.log(barX, graphY, barWidth, graphHeight * arr2[i]);
  }
  ctx.drawImage(overlay, 0, 0, 790, 460);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("./image.png", buffer);
}

run();
