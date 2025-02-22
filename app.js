const express = require("express");
const puppeteer = require('puppeteer');
const Diff = require('diff');

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

app.get("/", (req, res) => res.type('html').send(html));

app.post('/compare', async (req, res) => {
  const { text1, text2 } = req.body;
  const paragraphs1 = text1.split('\n');
  const paragraphs2 = text2.split('\n');

  let html = '<div id="diffOutput">';
  for (let i = 0; i < paragraphs1.length; i++) {
    const diff = Diff.diffWords(paragraphs1[i], paragraphs2[i]);
    diff.forEach(part => {
      if (part.added) {
        html += `<span class="added">${part.value}</span>`;
      } else if (part.removed) {
        html += `<span class="removed">${part.value}</span>`;
      } else {
        html += `<span>${part.value}</span>`;
      }
    });
    html += '<br>';
  }
  html += '</div>';

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const element = await page.$('#diffOutput');
  const screenshot = await element.screenshot({ type: 'png' });
  await browser.close();

  res.type('image/png').send(screenshot);
});

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`
