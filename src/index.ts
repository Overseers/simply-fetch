import nodeFetch from 'node-fetch';
import FormData from 'form-data';
import {
    REQUEST_OBJECT,
    REQUEST_OBJECT_FORMDATA,
    REQUEST_OUTPUT
} from './types';

export default function fetch(requestObject: REQUEST_OBJECT) {
    return new Promise((resolve, reject) => {
        let { url, body } = requestObject;
        const { method, headers, qs, formData, agent } = requestObject;
        if (!url) return reject('Bad request object');
        // reason for stringifying https://www.youtube.com/watch?v=ff4fgQxPaO0
        if (body && typeof body !== 'string') body = JSON.stringify(body);
        if (qs && typeof qs === 'object' && Object.keys(qs)) {
            Object.keys(qs).forEach((e, i) => {
                url += (!i) ? '?' : '&';
                if (Array.isArray(qs[e])) {
                    (<string[]>qs[e]).forEach((e1, i1) => {
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
                    (<REQUEST_OBJECT_FORMDATA>formData)[e].forEach((e1) => {
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
        return nodeFetch(
            url,
            {
                method,
                headers,
                body,
                agent
            },
        ).then((response) => {
            let body: string = '';
            response.body.setEncoding('utf8');
            response.body.on('data', (data) => { body += data; });
            response.body.on('end', () => {
                const output: REQUEST_OUTPUT = {
                    status: response.status,
                    headers: response.headers,
                    body: (() => {
                        try {
                            return JSON.parse(body);
                        } catch (err) {
                            return body;
                        }
                    })()
                };
                return (output.status < 400) ? resolve(output) : reject(output);
            });
            response.body.on('error', (err) => console.log('STREAM ERROR: ', err));
        }).catch((err) => {
            return reject(err);
        });
    });
}
