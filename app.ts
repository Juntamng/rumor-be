import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { createApi } from 'unsplash-js'
import IPexelsImage, { Client} from 'node-pexels'
import nodeFetch from 'node-fetch'

dotenv.config();

const app: Express = express()
const port = process.env.PORT
const unsplashKey:string = process.env.UNSPLASH_KEY || ""
const pexelsKey:string = process.env.PEXELS_KEY || ""

interface record {
  id: string,
  description: string | null,
  thumbImgUrl: string,
  regularImgUrl: string
}

interface itemData {
  id: string, 
  description: string|null, 
  urls: {
      regular:string, 
      thumb:string
  }
}

// interface pexelsItemData {
//   id: string, 
//   alt: string, 
//   src: {
//       tiny:string, 
//       medium:string
//   }
// }

app.use(express.json());

const allowedOrigins = ['*'];
const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options));

app.get('/', async (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Credentials', "true")
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  
  const client = new Client({ apiKey: pexelsKey })

  const page:number = (req.query.page) ? parseInt(req.query.page as string) : 1
  const query:string = (req.query.query) ? req.query.query as string : ""
  // const pageSize:number = 9

  if (query.trim().length === 0) {
    res.json([])  
    return
  }

  const arr:record[] = []
  const result = await client.v1.photos.search(query, { perPage: 4, page: page })
  result.photos.forEach((item: any) => {
    arr.push({
      id: item.id,
      description: item.alt,
      thumbImgUrl: item.src.tiny,
      regularImgUrl: item.src.medium
    })
  })

  const upsplash = createApi({
      // Don't forget to set your access token here!
      // See https://unsplash.com/developers
      accessKey: unsplashKey,
      fetch: nodeFetch,
  });

  const result2 = await upsplash.search
    .getPhotos({ 
      query: query, 
      orientation: "landscape",
      page: page,
      perPage: 5
    })
  
  result2.response?.results.forEach((item: itemData) => {
    arr.push({
      id: item.id,
      description: item.description,
      thumbImgUrl: item.urls.thumb,
      regularImgUrl: item.urls.regular
      })
  })

  res.json(arr)

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
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});