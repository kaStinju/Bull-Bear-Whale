import axios from "axios";
import { createCanvas, loadImage } from "canvas";
import * as fs from "fs";
import * as dotenv from "dotenv";

async function run() {
  dotenv.config();

  const ticker = "LINK";

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

  drawPicture();
}

async function drawPicture() {
  const overlay = await loadImage("./test.png");
  const canvas = createCanvas(790, 460);
  const ctx = canvas.getContext("2d");
  ctx.rect(376, 65, 710, 257);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.drawImage(overlay, 0, 0, 790, 460);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("./image.png", buffer);
}

run();
