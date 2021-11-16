import axios from "axios";
import * as dotenv from "dotenv";
import drawPicture from "./imageGeneration";

async function run() {
  dotenv.config();

  //get token prices
  const ticker = "LINK";

  const currency = "USD";
  const from = "2021-11-01";
  const to = "2021-11-07";
  const key_covalent = process.env.API_KEY_COVALENT;
  /*const res = await axios.get(
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
  console.log(prices);*/
  //must reverse prices
  //drawPicture(ticker, from, to, prices.reverse());
  drawPicture(
    ticker,
    from,
    to,
    [
      32.09862, 33.030907, 33.21997, 31.865974, 32.00435, 31.291933, 31.847345,
    ].reverse()
  );
}

run();
