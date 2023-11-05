const axios = require('axios');
const { JSDOM } = require('jsdom');

async function getLiveCmafUrl(streamUrl) {
 try {
    const response = await axios.get(streamUrl);
    const data = response.data;

    const dataOptionsRegex = /data-options="([^"]+)"/;
    const matches = dataOptionsRegex.exec(data);
    if (matches && matches.length >= 2) {
      return matches[1];
    } else {
      throw new Error('No data-options attribute found in the HTML content');
    }
 } catch (error) {
    console.error(`Failed to get liveCmafUrl: ${error.message}`);
    return null;
 }
}

async function main() {
 const streamUrl = 'https://ok.ru/videoembed/6618535763481';
 const liveCmafUrl = await getLiveCmafUrl(streamUrl);

 if (liveCmafUrl) {

    const { window } = new JSDOM(`<!DOCTYPE html><body>${liveCmafUrl}`);
    const dom = window.document;
    const donText = dom.body.textContent;
    const jsonObject = JSON.parse(donText);
    const flashvars = jsonObject.flashvars;
    const metadata = JSON.parse(flashvars.metadata);
    const liveCmafUrl2 = metadata.liveCmafUrl;
    const status = metadata.movie.status;
    console.log(status);
    console.log(liveCmafUrl2);

    // Update the status div
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = status;

    // Update the URL div
    const urlDiv = document.getElementById('url');
    urlDiv.textContent = liveCmafUrl2;

 } else {
    console.log('Source is not live or encountered an error');
 }
}

main();