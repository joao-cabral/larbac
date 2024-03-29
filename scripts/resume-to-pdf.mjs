import express from "express";
import path from "path";
import puppeteer from "puppeteer";

const app = express();
app.use(express.static(path.join("dist")));

const server = app.listen(18347);
const FILENAMES = ["curriculum-pt"];

const browser = await puppeteer.launch({
  headless: "new",
});

async function generatePDF(url, outputPath) {
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  await page.pdf({ path: outputPath, format: "A4", tagged: true, scale: 0.75 });
}

await generatePDF("http://localhost:18347/curriculum-pt", "dist/curriculum-pt.pdf");
// await generatePDF('http://localhost:18347/curriculum', 'dist/curriculum.pdf');

await browser.close();
server.close();
