const puppeteer = require('puppeteer');

async function crawl(url) {
  const browser = await puppeteer.launch();
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
    const response = await page.goto(link, { waitUntil: 'networkidle0', timeout: 5000 });
    if (!response.ok()) {
      console.log(`Broken link found: ${link}`);
    }
  }

  // Check each image for availability
  for (const image of images) {
    const response = await page.goto(image, { waitUntil: 'networkidle0', timeout: 5000 });
    if (!response.ok()) {
      console.log(`Missing image found: ${image}`);
    }
  }

  await browser.close();
}

crawl('https://www.example.com'); // Replace with your target website URL
