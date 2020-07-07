import fetch from 'node-fetch';
import FormData from 'form-data';

export default function fetch(requestObject) {
    return new Promise((resolve, reject) => {
        let output = {};
        let { url, body } = requestObject;
        const { method, headers, qs, formData, agent } = requestObject;
        if (!url) return reject('Bad request object');
        // reason for stringifying https://www.youtube.com/watch?v=ff4fgQxPaO0
        if (body && typeof body !== 'string') body = JSON.stringify(body);
        if (qs && typeof qs === 'object' && Object.keys(qs)) {
            Object.keys(qs).forEach((e, i) => {
                url += (!i) ? '?' : '&';
                if (Array.isArray(qs[e])) {
                    qs[e].forEach((e1, i1) => {
                        url += `${(!i1) ? '' : '&'}${e}=${qs[e][e1]}`;
                    });
                } else {
                    url += `${e}=${qs[e]}`;
                }
            });
        }
        if (formData) {
            let form = new FormData();
            Object.keys(formData).forEach((e) => {
                if (e === 'files') {
                    formData[e].forEach((e1) => {
                        form.append(
                            'file',
                            e1.value,
                            {
                                filename: `${e1.options.filename}.${e1.options.contentType.split('/')[1]}`,
                                contentType: e1.options.contentType
                            }
                        );
                    });
                } else {
                    form.append(e, formData[e]);
                }
            });
            body = form;
        }
        return fetch(
            url,
            {
                method,
                headers,
                body,
                agent
            },
        ).then((response) => {
            output.status = response.status;
            output.headers = response.headers;
            let body = '';
            response.body.setEncoding('utf8');
            response.body.on('data', (data) => { body += data; });
            response.body.on('end', () => {
                try {
                    output.body = JSON.parse(body);
                } catch (err) {
                    output.body = body;
                }
                return (output.status < 400) ? resolve(output) : reject(output);
            });
            response.body.on('error', (err) => console.log('STREAM ERROR: ', err));
        }).catch((err) => {
            return reject(err);
        });
    });
}
