var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createApi } from 'unsplash-js';
import { Client } from 'node-pexels';
import nodeFetch from 'node-fetch';
dotenv.config();
const app = express();
const port = process.env.PORT;
const unsplashKey = process.env.UNSPLASH_KEY || "";
const pexelsKey = process.env.PEXELS_KEY || "";
// interface pexelsItemData {
//   id: string, 
//   alt: string, 
//   src: {
//       tiny:string, 
//       medium:string
//   }
// }
app.use(express.json());
const allowedOrigins = ['http://localhost:3000'];
const options = {
    origin: allowedOrigins
};
app.use(cors(options));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const client = new Client({ apiKey: pexelsKey });
    const page = (req.query.page) ? parseInt(req.query.page) : 1;
    const query = req.query.query;
    // const pageSize:number = 9
    const arr = [];
    const result = yield client.v1.photos.search(query, { perPage: 4, page: page });
    result.photos.forEach((item) => {
        arr.push({
            id: item.id,
            description: item.alt,
            thumbImgUrl: item.src.tiny,
            regularImgUrl: item.src.medium
        });
    });
    const upsplash = createApi({
        // Don't forget to set your access token here!
        // See https://unsplash.com/developers
        accessKey: unsplashKey,
        fetch: nodeFetch,
    });
    const result2 = yield upsplash.search
        .getPhotos({
        query: query,
        orientation: "landscape",
        page: page,
        perPage: 5
    });
    (_a = result2.response) === null || _a === void 0 ? void 0 : _a.results.forEach((item) => {
        arr.push({
            id: item.id,
            description: item.description,
            thumbImgUrl: item.urls.thumb,
            regularImgUrl: item.urls.regular
        });
    });
    res.json(arr);
    // .then(result => {
    // res.json(result.response)
    // result.response?.results.forEach( (item: itemData) => {
    //     arr.push({
    //         id: item.id,
    //         description: item.description,
    //         thumbImgUrl: item.urls.thumb,
    //         regularImgUrl: item.urls.regular
    //     })
    // })
    // res.json(arr)
    // })
    // res.send('Express + TypeScript Server');
    // res.json({
    //   'name': 'typescitp_api',
    //   'path': '/',
    //   'work': 'search_other_apis'
    // });
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
