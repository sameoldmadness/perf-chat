const fs = require('fs');
const { join } = require('path');

const cheerio = require('cheerio');
const mime = require('mime');

const extractResources = filePath => {
    const html = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const $ = cheerio.load(html);

    const scripts = $('script').toArray().map(x => x.attribs.src);
    const styles = $('link[rel="stylesheet"]').toArray().map(x => x.attribs.href);
    const images = $('img').toArray().map(x => x.attribs.src);
    const resources = [...scripts, ...styles, ...images].filter(x => x && x[0] === '/');

    return resources.map(resource => ({
        path: resource,
        mime: mime.lookup(resource),
    }));
}

module.exports = page => {
    return (req, res, next) => {
        const pageFileName = join(__dirname, `../pages/${page}.html`);
        const resources = extractResources(pageFileName);

        resources.forEach(resource => {
            const fileName = join(__dirname, `../static/${resource.path}`);
            const stream = res.push(resource.path, {
                status: 200,
                method: 'GET',
                request: { accept: '*/*' },
                response: { 'content-type': resource.mime },
            });

            stream.end(fs.readFileSync(fileName));
        });

        next();
    };
};
