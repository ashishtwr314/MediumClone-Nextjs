// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import sanityClient from "@sanity/client";
import { CommentResponseType } from "../../typings";

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersion: "2021-10-21",
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};

const client = sanityClient(config);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommentResponseType>
) {
  if (req.method == "GET")
    res.status(400).json({ message: "Method not allowed", err: true });

  const { _id, name, email, comment } = JSON.parse(req.body);

  try {
    await client.create({
      _type: "comment",
      post: {
        _type: "reference",
        _ref: _id,
      },
      name,
      email,
      comment,
    });

    res
      .status(200)
      .json({ err: false, message: "Comment Successfully created!" });
  } catch (err: any) {
    res.status(500).json({
      err: true,
      message: err.message,
    });
  }
  console.log(req.body);
}
