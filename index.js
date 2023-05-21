import { launch } from 'puppeteer';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
    encoding: "utf8",
    path: path.resolve(process.cwd(), ".env"),
});

async function crawl(url) {
  const browser = await launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Extract all links and images from the page
  const links = await page.$$eval('a', (elements) =>
    elements.map((el) => el.href)
  );

  const images = await page.$$eval('img', (elements) =>
    elements.map((el) => el.src)
  );

  // Check each link for HTTP status code
  for (const link of links) {
    const response = await page.goto(link, { waitUntil: 'networkidle0' });
    if (!response) {
      console.log(`Broken link found: ${link}`);
    }
  }

  // Check each image for availability
  for (const image of images) {
    const response = await page.goto(image, { waitUntil: 'networkidle0'});
    if (!response) {
      console.log(`Missing image found: ${image}`);
    }
  }

  await browser.close();
}

crawl(process.env.WEBSITE_TO_CRAWL); // Replace with your target website URL
