export default function drawGraph(startDate, endDate, prices, firstPrice, ctx) {
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
      if (firstPrice <= prices[i]) {
        ctx.fillStyle = "#2FF541";
      } else {
        ctx.fillStyle = "#F02323";
      }
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
