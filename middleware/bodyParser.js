import querystring from 'querystring';

export default function bodyParser(req, res, next) {
    const contentType = req.headers['content-type'];

    if (contentType && contentType.startsWith('application/x-www-form-urlencoded')) {
        let data = '';
        req.on('data', chunk => {
        data += chunk;
        });
        req.on('end', () => {
        req.body = querystring.parse(data);
        });
    }
    next();
}