import S3 from "react-aws-s3";
import { S3KEY } from "@/constants/keywords";

import AWS from "aws-sdk";
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || require("buffer").Buffer;
}
export async function upload(file, folderName, extension, contentType) {
  try {
    console.log("extension", extension);
    console.log("contentType", contentType);
    console.log("file 11", file);
    console.log("folderName", folderName);
    const s3 = new AWS.S3({
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
    });

    const params = {
      Bucket: `${S3KEY.bucket}/userImages`,
      Key: file.name,
      Body: file,
      ContentType: extension ? contentType : "image/png",
      ACL: "public-read",
    };

    console.log("Params->", params);
    var response = await s3.upload(params).promise();
    console.log("response->", response);

    return response;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
  }
}
