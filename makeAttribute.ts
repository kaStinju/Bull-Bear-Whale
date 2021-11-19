interface MetaType {
  background: {
    randBackground: string;
    randSand: string;
    randSign: string;
  };
  character: {
    randSkin: string;
    randEye: string;
  };
  objects: string;
  randBorder: string;
}

export default async function makeAttribute(meta: MetaType) {
  const background = meta.background.randBackground.split("/")[3].split(".")[0];
  const sand = meta.background.randSand.split("/")[3].split(".")[0];
  const sign = meta.background.randSign.split("/")[3].split(".")[0];
  const objects = meta.objects;
  const skin = meta.character.randSkin
    .split("/")
    [meta.character.randSkin.split("/").length - 1].split(".")[0];
  const eye = meta.character.randEye.split("/")[3].split(".")[0];
  const border = meta.randBorder;
  const attribute = [
    {
      trait_type: "Background",
      value: background,
    },
    {
      trait_type: "Sand",
      value: sand,
    },
    {
      trait_type: "Sign",
      value: sign,
    },
    {
      trait_type: "Skin",
      value: skin,
    },
    {
      trait_type: "Eye",
      value: eye,
    },
    {
      trait_type: "Objects",
      value: objects,
    },
    {
      trait_type: "Sign",
      value: sign,
    },
    {
      trait_type: "Border",
      value: border,
    },
    {
      display_type: "number",
      trait_type: "Generation",
      value: 0,
    },
  ];
  return attribute;
}
