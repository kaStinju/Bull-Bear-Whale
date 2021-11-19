import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();

async function uploadFile() {
  const form = new FormData();
  const fileStream = fs.createReadStream("image.png");
  form.append("file", fileStream);
  const res = await axios.post("https://api.nftport.xyz/v0/files", form, {
    headers: {
      Authorization: process.env.API_KEY_NFTPORT,
      ...form.getHeaders(),
    },
  });

  const url = res.data.ipfs_url;
  return url;
}

async function uploadMetadata(url, name, description, attributes) {
  const res = await axios.post(
    "https://api.nftport.xyz/v0/metadata",
    {
      name,
      description,
      file_url: url,
      attributes,
    },
    {
      headers: {
        Authorization: process.env.API_KEY_NFTPORT,
      },
    }
  );
  const uri = res.data.metadata_uri;
  console.log(uri);
  return uri;
}

async function mint(uri, address) {
  const res = await axios.post(
    "https://api.nftport.xyz/v0/mints/customizable",
    {
      chain: "rinkeby",
      contract_address: "0xCCAebaA0C8A1a1fBE7e9A879167ae7f74FeE6a5d",
      metadata_uri: uri,
      mint_to_address: address,
    },
    {
      headers: {
        Authorization: process.env.API_KEY_NFTPORT,
      },
    }
  );
  console.log(res.data);
}

export default async function upload(name, description, attributes) {
  const url = await uploadFile();
  const uri = await uploadMetadata(url, name, description, attributes);
  await mint(uri, "0x6b690c101122c5e1271580cc5732cdbdfa57d377");
}
