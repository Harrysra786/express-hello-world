const express = require('express');
const { JSDOM } = require('jsdom');
const { createCanvas, loadImage } = require('canvas');
const Diff = require('diff');

const app = express();
app.use(express.json());

app.post('/compare', async (req, res) => {
  const { text1, text2 } = req.body;
  const paragraphs1 = text1.split('\n');
  const paragraphs2 = text2.split('\n');

  const dom = new JSDOM(`<!DOCTYPE html><body><div id="diffOutput"></div></body>`);
  const outputDiv = dom.window.document.getElementById('diffOutput');

  for (let i = 0; i < paragraphs1.length; i++) {
    const diff = Diff.diffWords(paragraphs1[i], paragraphs2[i]);
    diff.forEach(part => {
      const span = dom.window.document.createElement('span');
      span.textContent = part.value;
      if (part.added) {
        span.classList.add('added');
      } else if (part.removed) {
        span.classList.add('removed');
      }
      outputDiv.appendChild(span);
    });
    outputDiv.appendChild(dom.window.document.createElement('br'));
  }

  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  ctx.fillText(outputDiv.innerHTML, 50, 50);

  const buffer = canvas.toBuffer('image/png');
  res.type('image/png').send(buffer);
});

app.listen(3000, () => console.log('Server started on port 3000'));
