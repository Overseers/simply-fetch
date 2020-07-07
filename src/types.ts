import { HeadersInit } from 'node-fetch';
import { Agent } from 'https';

export type REQUEST_OBJECT = {
    url: string;
    method?: string;
    headers?: HeadersInit;
    qs?: {
        [_: string]: string | string[];
    };
    body?: any;
    formData?: REQUEST_OBJECT_FORMDATA[];
    agent?: Agent;
};

export type REQUEST_OBJECT_FORMDATA = {
    files?: {
        value: any;
        options: {
            filename: string;
            contentType: string;
        };
    }[];
    [_: string]: any;
};

export type REQUEST_OUTPUT = {
    status: number;
    headers: object;
    body: string | object;
};
