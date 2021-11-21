import axios from "axios";
import * as dotenv from "dotenv";
import imageGeneration from "./imageGeneration";
import { format, subDays } from "date-fns";
import upload from "./uploadFileRinkeby";
import makeAttribute from "./makeAttribute";

async function run() {
  dotenv.config();

  //get date
  const lastDate = format(new Date(), "yyyy-MM-dd"); //today or (last day it goes until)
  const firstDate = format(subDays(new Date(), 6), "yyyy-MM-dd"); //first bar on chart
  const beforeDate = format(subDays(new Date(), 7), "yyyy-MM-dd"); //day before week

  //const listOfTokens = ["ETH", "LRC", "SHIB", "LINK", "MATIC"];
  const listOfTokens = ["MATIC"];
  for (let i = 0; i < listOfTokens.length; i++) {
    //get token prices
    const ticker = listOfTokens[i];
    const currency = "USD";
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
    const info = await imageGeneration(
      ticker,
      from,
      to,
      prices.reverse().slice(1),
      prices[0],
      firstDate
    );
    const name = `${ticker} from ${firstDate} to ${lastDate}`;
    const attributes = await makeAttribute(info);

    //nft port + ipfs storage + meta
    upload(name, `Bull Bear Whale Generation 0`, attributes);
  }
}

run();
