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
const stylesDir = '/Styles';

const linksWithWebArchive = [];
const originalLinks = [];
const imgs = [];
const scriptsLinks = [];
const stylesLinks = [];
const webArchiveURL = 'https://web.archive.org';
const regexGetFileName = /(\/*.*\/)/;

const getSite = async (url) => {
  let foldersCount = '';
  try {
    const res = await axios.get(url);
    const HTML = res.data;
    const $ = cheerio.load(HTML);
    let newHTML;
    var noStringifiedDate = HTML;
    const fullURL = url.slice(31);
    const cleanUrl = fullURL.split('/');
    const folders = cleanUrl.map((name) => {
      if (name.includes(':')) {
        return name.replace(':', '_');
      } else {
        return name;
      }
    });

    for (let i = 0; i < folders.length; i++) {
      if (folders[i] !== '') {
        if (!fs.existsSync(folders[i])) {
          if (foldersCount === '') {
            foldersCount += folders[i];
            fs.mkdirSync(foldersCount.replace('www.', '/'));
          } else {
            foldersCount += '/' + folders[i];
          }
        } else {
          if (foldersCount === '') {
            foldersCount += folders[i];
          } else {
            return false;
          }
        }
      }
    }

    const createFile = (path, data) => {
      fs.writeFile(path, data, function (err) {
        if (err) throw err;
      });
    };

    const createFolder = (name) => {
      if (!fs.existsSync(name)) fs.mkdirSync(name);
    };

    const replaceLink = (html, prevURL, newURL) => {
      const json = JSON.stringify(html).replace(prevURL, newURL);
      newHTML = JSON.parse(json);
      return newHTML;
    };

    const createAndGetStyles = () => {
      createFolder(foldersCount + stylesDir);

      $('link').each(async (i, link) => {
        const linkObj = link.attribs;
        if (linkObj.rel === 'stylesheet') {
          if (linkObj.href.includes(webArchiveURL)) {
            const href = linkObj.href;
            noStringifiedDate = replaceLink(
              noStringifiedDate,
              href,
              `/Styles/style${i}.css`
            );
            setInterval(async () => {
              try {
                const res = await axios.get(href);

                const style = res.data;
                stylesLinks.push(href);

                createFile(`${foldersCount}${stylesDir}/style${i}.css`, style);
              } catch (error) {
                return error;
              }
            }, 1000);
          } else {
            const href = linkObj.href;
            const fullURL = `${webArchiveURL}${href}`;
            stylesLinks.push(fullURL);
            noStringifiedDate = replaceLink(
              noStringifiedDate,
              href,
              `/Styles/style${i}.css`
            );

            setInterval(async () => {
              try {
                const res = await axios
                  .get(fullURL)
                  .catch((err) => console.log(err));

                const style = res.data;

                createFile(`${foldersCount}${stylesDir}/style${i}.css`, style);
              } catch (error) {
                return error;
              }
            }, 1000);
          }
        }
      });

      createFile(
        `${foldersCount}${stylesDir}/stylesLog.txt`,
        `STYLES\r\nSTYLE TYPE ${scriptsLinks.join('\r\nSTYLE TYPE ')}`
      );
    };

    const createAndGetScripts = () => {
      if (!fs.existsSync(foldersCount + scriptsDir))
        fs.mkdirSync(foldersCount + scriptsDir);

      $('script').each((i, script) => {
        const href = script.attribs.src;

        if (href !== undefined) {
          if (href.includes(webArchiveURL)) {
            noStringifiedDate = replaceLink(
              noStringifiedDate,
              href,
              `/Js/script${i}.js`
            );

            setInterval(async () => {
              try {
                const res = await axios.get(href);
                const script = res.data;
                scriptsLinks.push(href);
                createFile(
                  `${foldersCount}${scriptsDir}/script${i}.js`,
                  script
                );
              } catch (error) {
                return error;
              }
            }, 1000);
          } else {
            noStringifiedDate = replaceLink(
              noStringifiedDate,
              href,
              `/Js/script${i}.js`
            );

            const fullURL = `${webArchiveURL}${href}`;
            scriptsLinks.push(fullURL);

            try {
              setInterval(async () => {
                try {
                  const res = await axios.get(fullURL);
                  const script = res.data;

                  createFile(
                    `${foldersCount}${scriptsDir}/script${i}.js`,
                    script
                  );
                } catch (error) {
                  return error;
                }
              }, 1000);
            } catch (error) {
              return error;
            }
          }
        }
      });

      createFile(
        `${foldersCount}${scriptsDir}/scriptsLog.txt`,
        `SCRIPTS\r\nJS TYPE ${scriptsLinks.join('\r\nJS TYPE ')}`
      );
    };

    const createAndGetLinks = () => {
      createFolder(foldersCount + linksDir);

      $('a').each((i, link) => {
        const href = link.attribs.href;

        linksWithWebArchive.push(href);

        if (href.includes(webArchiveURL)) {
          const withoutWebArchive = urlapi.parse(href);
          const original = withoutWebArchive.pathname.slice(20);
          originalLinks.push(original);

          noStringifiedDate = replaceLink(noStringifiedDate, href, original);
        } else {
          const original = href.slice(23);
          originalLinks.push(original);

          noStringifiedDate = replaceLink(
            noStringifiedDate,
            href,
            original.slice(20)
          );
        }
      });

      createFile(
        `${foldersCount}${linksDir}/linksWithWebArchiveLog.txt`,
        `Link with webArchive\r\nLINK TYPE ${linksWithWebArchive.join(
          '\r\nLINK TYPE '
        )}`
      );

      createFile(
        `${foldersCount}${linksDir}/originalLinksLog.txt`,
        `Original links\r\nLINK TYPE ${originalLinks.join('\r\nLINK TYPE ')}`
      );
    };

    const createAndGetImages = () => {
      createFolder(foldersCount + imgsDir);

      const replaceUrl = (html, prevURL, newURL) => {
        const json = JSON.stringify(html).replace(prevURL, newURL);
        newHTML = JSON.parse(json);
        return newHTML;
      };

      const downloadImg = (img, imgSrc) => {
        const fileName = imgSrc.split(regexGetFileName)[2];

        noStringifiedDate = replaceUrl(
          noStringifiedDate,
          img.attribs.src,
          `/${foldersCount}/Images/${fileName}`
        );

        const dl = new DownloaderHelper(imgSrc, `./${foldersCount + imgsDir}`, {
          override: true,
        });

        dl.on('end', () => null);
        dl.on('error', () => console.log('BIG FUCKIN ERROR'));
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

      createFile(
        `${foldersCount}${imgsDir}/ImagesFromSiteLog.txt`,
        `Images\r\nIMG TYPE ${imgs.join('\r\nIMG TYPE ')}`
      );
    };

    createAndGetLinks();
    createAndGetImages();
    createAndGetScripts();
    createAndGetStyles();

    //noStringifiedDate.replace('__wm.init("https://web.archive.org/web")', ' ');
    createFile(`./${foldersCount}/index.html`, noStringifiedDate);
  } catch (error) {
    console.log(error, 'error');
    console.log(foldersCount, 'from the bottom');
  }
};

app.post('/api/posturl', async (req, res) => {
  res.send('why are you like that?');
});

// getSite('https://web.archive.org/web/20170706090607/http://apteka36-6.dn.ua/');
// https://web.archive.org/web/20170707150534/http://www.apteka36-6.dn.ua/index.php/2010-09-22-13-31-31/2600
// https://web.archive.org/web/20170706090607/http://apteka36-6.dn.ua/
const PORT = 2000;

app.listen(PORT);

// arr.slice(200, 201).forEach((arr) => {
//   if (arr[1] === 'text/html') {
//     console.log('got him');
//     getSite(`${webArchiveURL}/${arr[0]}`);
//   }
// });
