import axios from "axios";
import { createCanvas, loadImage } from "canvas";
import * as fs from "fs";
import * as dotenv from "dotenv";

async function run() {
  dotenv.config();

  //get token prices
  const ticker = "LRC";

  const currency = "USD";
  const from = "2021-11-01";
  const to = "2021-11-07";
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
  //must reverse prices
  drawPicture(ticker, from, to, prices.reverse());
}

async function drawPicture(ticker, startDate, endDate, prices) {
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

  //create canvas
  const canvas = createCanvas(790, 460);
  const ctx = canvas.getContext("2d");

  //apply image overlay
  const overlay = await loadImage("./test.png");
  ctx.drawImage(overlay, 0, 0, 790, 460);

  //draw graph
  //ctx.rect(graphX, graphY, graphWidth, graphHeight);
  //ctx.fillStyle = "blue";
  //ctx.fill();
  for (let i = 0; i < numberOfBars; i++) {
    if (i == 0) {
      ctx.fillStyle = "#8951d7";
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
    //highest and lowest text
    ctx.fillStyle = "#000000";
    ctx.fillText(largest.toPrecision(7).toString(), boxX + 2.5, boxY + 5);
    ctx.fillText(
      smallest.toPrecision(7).toString(),
      boxX + 2.5,
      boxY + boxHeight - 3
    );
    //draw date
    ctx.save();
    ctx.translate(390, 215);
    ctx.rotate(270 * (Math.PI / 180));
    ctx.font = "10px sans-serif";
    ctx.fillText(`${startDate} --> ${endDate}`, 0, 0);
    ctx.restore();

    //draw ticker
    ctx.save();
    ctx.font = "40px sans-serif";
    ctx.translate(260, 415);
    ctx.rotate(350 * (Math.PI / 180));
    ctx.fillText(ticker, 0, 0);
    ctx.restore();

    //draw price
    ctx.save();
    ctx.translate(320, 435);
    ctx.rotate(2.5 * (Math.PI / 180));
    ctx.font = "40px sans-serif";

    let change = 0;
    let sign = "+";
    const firstDay = prices[0];
    const lastDay = prices[prices.length - 1];
    if (firstDay < lastDay) {
      change = ((lastDay - firstDay) / firstDay) * 100;
      ctx.fillStyle = "#00FF00";
    } else if (lastDay < firstDay) {
      change = ((firstDay - lastDay) / firstDay) * 100;
      sign = "-";
      ctx.fillStyle = "#FF0000";
    } else {
      change = 0;
      ctx.fillStyle = "#00FF00";
    }
    const result = change.toFixed(1);
    ctx.fillText(`${sign}${result}%`, 0, 0);
    ctx.restore();
  }

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("./image.png", buffer);
}

run();
