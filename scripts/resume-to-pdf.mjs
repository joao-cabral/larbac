import express from "express";
import { copyFileSync, existsSync } from "node:fs";
import path from "path";
import puppeteer from "puppeteer";

const app = express();
app.use(express.static(path.join("dist")));

const server = app.listen(18347);
const macOSChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const executablePath = process.platform === "darwin" && existsSync(macOSChrome)
  ? macOSChrome
  : undefined;

const browser = await puppeteer.launch({
  headless: "new",
  executablePath,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-gpu',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding'
  ],
});

async function generatePDF(url, outputPath) {
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  await page.pdf({
    path: outputPath,
    format: "A4",
    tagged: true,
    printBackground: true,
    scale: 0.72,
    margin: {
      top: "12mm",
      right: "14mm",
      bottom: "12mm",
      left: "14mm",
    },
  });
}

const publicPdfPath = "public/curriculum-pt.pdf";
const distPdfPath = "dist/curriculum-pt.pdf";

await generatePDF("http://localhost:18347/curriculum-pt", publicPdfPath);
copyFileSync(publicPdfPath, distPdfPath);
// await generatePDF('http://localhost:18347/curriculum', 'dist/curriculum.pdf');

await browser.close();
server.close();
