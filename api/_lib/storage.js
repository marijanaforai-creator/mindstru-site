import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

function getClient(){
  if(!process.env.STORAGE_ENDPOINT||!process.env.STORAGE_ACCESS_KEY_ID||!process.env.STORAGE_SECRET_ACCESS_KEY){
    throw new Error("Storage nije konfigurisan.");
  }
  return new S3Client({
    region:process.env.STORAGE_REGION||"auto",
    endpoint:process.env.STORAGE_ENDPOINT,
    forcePathStyle:process.env.STORAGE_FORCE_PATH_STYLE==="true",
    credentials:{
      accessKeyId:process.env.STORAGE_ACCESS_KEY_ID,
      secretAccessKey:process.env.STORAGE_SECRET_ACCESS_KEY
    }
  });
}

function getBucket(){
  if(!process.env.STORAGE_BUCKET)throw new Error("STORAGE_BUCKET nije podešen.");
  return process.env.STORAGE_BUCKET;
}

export async function createUploadUrl({key,contentType}){
  const command=new PutObjectCommand({
    Bucket:getBucket(),
    Key:key,
    ContentType:contentType||"application/octet-stream"
  });
  return getSignedUrl(getClient(),command,{expiresIn:900});
}

export async function createDownloadUrl(key){
  const command=new GetObjectCommand({Bucket:getBucket(),Key:key});
  return getSignedUrl(getClient(),command,{expiresIn:900});
}

export async function deleteStoredObject(key){
  await getClient().send(new DeleteObjectCommand({Bucket:getBucket(),Key:key}));
}
