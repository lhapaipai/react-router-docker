import {Server}  from'@tus/server';
import {FileStore} from'@tus/file-store';
import crypto from 'node:crypto'
import {S3Store} from "@tus/s3-store"
import 'dotenv/config'
import { PrismaClient } from 'database';

const prisma = new PrismaClient();

const host = '127.0.0.1'
const port = 1080
const server = new Server({
  path: '/files',
  datastore: new FileStore({directory: './files'}),
  // datastore: new S3Store({
  //   partSize: 8 * 1024 * 1024, // Each uploaded part will have ~8MiB,
  //   s3ClientConfig: {
  //     bucket: process.env.S3_BUCKET ?? '',
  //     region: process.env.S3_REGION ?? '',
  //     credentials: {
  //       accessKeyId: process.env.S3_ACCESS_KEY ?? '',
  //       secretAccessKey: process.env.S3_SECRET_KEY ?? '',
  //     },
  //   },
  // }),
  // https://github.com/tus/tus-node-server/tree/main/packages/server#optionsgenerateurl
  namingFunction(req, metadata) {
    const id= crypto.randomBytes(16).toString('hex');
    return `raw/${id}`
  },
  generateUrl(req, {proto, host, path, id}) {
    id = Buffer.from(id, 'utf-8').toString("base64url");
    return `${proto}://${host}${path}/${id}`;
  },
  getFileIdFromRequest(req, lastPath = '') {
    const id = Buffer.from(lastPath, "base64url").toString("utf-8")
    return id
  },
  async onUploadCreate(req, res, upload) {
    return res
  },
  async onUploadFinish(req, res, upload) {

    const media = await prisma.media.create({
      data: {
        id: upload.id,
        "mimeType": "image",
        origin: "local",
      }
    })

    return {
      res,
      status_code: 200,
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        id: upload.id,
        metadata: upload.metadata,
        storage: upload.storage,
        media
      })
    }
  },
})

const storageFromS3 = {
  "type":"s3",
  "path":"raw/f479642baa8800cb5254c7a3eca70bda",
  "bucket":"melodino-dev-local"
};
const storageFromFile = {
  "type":"file",
  "path":"./files/raw/8e48659af51216bbc782697fb45153f3"
}
server.listen({host, port})