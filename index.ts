import axios from "axios";
import * as dotenv from "dotenv";
import imageGeneration from "./imageGeneration";
import { format, subDays } from "date-fns";
import upload from "./uploadFileRinkeby";

async function run() {
  dotenv.config();

  //get date
  const lastDate = format(new Date(), "yyyy-MM-dd");
  const firstDate = format(subDays(new Date(), 6), "yyyy-MM-dd");
  const beforeDate = format(subDays(new Date(), 7), "yyyy-MM-dd");

  //get token prices
  const ticker = "SHIB";
  const currency = "USD";

  /*const from = "2021-11-01";
  const to = "2021-11-08";
  */
  const from = beforeDate;
  const to = lastDate;

  //get ticker data
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
  //must reverse prices
  //drawPicture(ticker, from, to, prices.reverse());
  /*const prices = [
    30.847345, 32.09862, 33.030907, 33.21997, 31.865974, 32.00435, 31.291933,
    31.847345,
  ];*/

  const info = await imageGeneration(
    ticker,
    from,
    to,
    prices.reverse().slice(1),
    prices[0],
    firstDate
  );
  console.log(info);
  const name = `${ticker} from ${lastDate} to ${firstDate}`;

  upload(name, ``, attributes(info));
}

function attributes(meta) {
  const background = meta.background.randBackground.split("/")[3].split(".")[0];
  const sand = meta.background.randSand.split("/")[3].split(".")[0];
  const sign = meta.background.randSign.split("/")[3].split(".")[0];
  const objects = meta.objects;
  const skin = meta.character.randSkin
    .split("/")
    [meta.character.randSkin.split("/").length - 1].split(".")[0];
  const eye = meta.character.randEye.split("/")[3].split(".")[0];
  const border = meta.randBorder;
  const change = meta.changeFinal;
  const attribute = [
    {
      "trait_type": "Background",
      "value": background,
    },
    {
      "trait_type": "Sand",
      "value": sand,
    },
    {
      "trait_type": "Sign",
      "value": sign,
    },
    {
      "trait_type": "Skin",
      "value": skin,
    },
    {
      "trait_type": "Eye",
      "value": eye,
    },
    {
      "trait_type": "Objects",
      "value": objects,
    },
    {
      "trait_type": "Sign",
      "value": sign,
    },
    {
      "trait_type": "Border",
      "value": border,
    },
    {
      "display_type": "number",
      "trait_type": "Generation",
      "value": 0,
    },
  ];
  return attribute;
}

run();
