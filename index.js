const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const urlapi = require('url');
const fs = require('fs');
const {DownloaderHelper} = require('node-downloader-helper');

const app = express();

const imgsDir = '/Images';
const linksDir = '/Links';
const scriptsDir = '/Js';
const host = 'http://127.0.0.1:5500';

const linksWithWebArchive = [];
const originalLinks = [];
const imgs = [];
const scriptsLinks = [];
const webArchiveURL = 'https://web.archive.org';

const getSite = async (url) => {
  try {
    const res = await axios.get(url);
    const HTML = res.data;
    const $ = cheerio.load(HTML);
    let newHTML;
    var noStringifiedDate = HTML;
    const folderName = url.slice(50);

    if (!fs.existsSync(folderName)) fs.mkdirSync(folderName);

    const createAndGetScripts = () => {
      if (!fs.existsSync(folderName + scriptsDir))
        fs.mkdirSync(folderName + scriptsDir);

      $('script').each((i, script) => {
        const href = script.attribs.src;
        if (href !== undefined) scriptsLinks.push(href);
      });

      fs.writeFile(
        `${folderName}${scriptsDir}/linksWithWebArchiveLog.txt`,
        `SCRIPTS\r\nJS TYPE ${scriptsLinks.join('\r\nJS TYPE ')}`,
        function (err) {
          if (err) throw err;
        }
      );
    };

    const createAndGetLinks = () => {
      if (!fs.existsSync(folderName + linksDir))
        fs.mkdirSync(folderName + linksDir);

      $('a').each((i, link) => {
        const href = link.attribs.href;
        linksWithWebArchive.push(href);

        if (href.includes(webArchiveURL)) {
          const withoutWebArchive = urlapi.parse(href);
          const original = withoutWebArchive.pathname.slice(20);
          originalLinks.push(original);
        } else {
          const original = href.slice(20);
          originalLinks.push(original);
        }
      });

      fs.writeFile(
        `${folderName}${linksDir}/linksWithWebArchiveLog.txt`,
        `Link with webArchive\r\nLINK TYPE ${linksWithWebArchive.join(
          '\r\nLINK TYPE '
        )}`,
        function (err) {
          if (err) throw err;
        }
      );
      fs.writeFile(
        `${folderName}${linksDir}/originalLinksLog.txt`,
        `Original links\r\nLINK TYPE ${originalLinks.join('\r\nLINK TYPE ')}`,
        function (err) {
          if (err) throw err;
        }
      );
    };

    const createAndGetImages = () => {
      if (!fs.existsSync(folderName + imgsDir))
        fs.mkdirSync(folderName + imgsDir);

      const replaceUrl = (html, prevURL, newURL) => {
        const json = JSON.stringify(html).replace(prevURL, newURL);
        newHTML = JSON.parse(json);
        return newHTML;
      };

      const downloadImg = (img, imgSrc) => {
        const fileName = imgSrc.split(/(\/*.*\/)/)[2];

        noStringifiedDate = replaceUrl(
          noStringifiedDate,
          img.attribs.src,
          `${host}/${folderName}Images/${fileName}`
        );
        const dl = new DownloaderHelper(imgSrc, `./${folderName + imgsDir}`, {
          override: true,
        });

        dl.on('end', () => null);
        dl.start();
      };

      $('img').each(function (i, img) {
        imgs.push(img.attribs.src);
        if (img.attribs.src.includes(webArchiveURL)) {
          downloadImg(img, img.attribs.src);
        } else {
          const tempURL = webArchiveURL + img.attribs.src;
          downloadImg(img, tempURL);
        }
      });

      fs.writeFile(
        `${folderName}${imgsDir}/ImagesFromSiteLog.txt`,
        `Images\r\nIMG TYPE ${imgs.join('\r\nIMG TYPE ')}`,
        function (err) {
          if (err) throw err;
        }
      );
    };

    createAndGetLinks();
    createAndGetImages();
    createAndGetScripts();

    fs.writeFile(`./${folderName}/index.html`, noStringifiedDate, function (
      err
    ) {
      if (err) throw err;
    });
  } catch (error) {
    console.log(error);
  }
};

getSite('https://web.archive.org/web/20170706090607/http://apteka36-6.dn.ua/');

const PORT = 2000;

app.listen(PORT);
