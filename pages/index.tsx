import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import Header from "../components/Header/Header";
import { sanityClient, urlFor } from "../sanity";
import { Posts } from "../typings";

interface Props {
  posts: [Posts];
}

const Home = (props: Props) => {
  const { posts } = props;
  return (
    <div className="">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="banner flex justify-between items-center bg-yellow-400 border-black border-y  py-10 lg:py-0 max-w-7xl mx-auto">
        <div className="space-y-4 px-10">
          <h1 className="text-6xl max-w-xl font-serif">
            <span className="underline decoration-black decoration-4">
              Medium
            </span>{" "}
            is a place to write, read, and connect
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Reprehenderit ipsum quasi similique perspiciatis sint officia fuga
          </p>
        </div>

        <div className="font-serif">
          <img
            className="hidden md:inline-flex h-32 lg:h-full"
            src="https://accountabiLitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
          />
        </div>
      </div>

      <div className="posts grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-7xl mx-auto my-10">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="post border rounded-lg cursor-pointer group">
              <div className="image overflow-hidden">
                {post.mainImage ? (
                  <img
                    className="h-60 w-full object-cover group-hover:scale-105 transition-all duration-200 ease-in-out"
                    src={
                      urlFor(post.mainImage || null)
                        .width(200)
                        .url()!
                    }
                    alt="post-image"
                  />
                ) : (
                  <div className="h-60 bg-gray-100"></div>
                )}
              </div>
              <div className="flex justify-between px-5 py-3">
                <div>
                  <p className="text-xl font-bold">{post.title}</p>
                  <p className="text-sm">By {post.author.name}</p>
                </div>
                <div>
                  <img
                    className="w-12 h-12 rounded-full"
                    src={urlFor(post.author.image).width(200).url()}
                    alt="post-author-image"
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps = async (context: any) => {
  const query = `
    *[_type == "post"]{
      _id,
      _createdAt,
      title,
      mainImage,
      description,
      author -> {
        name,
        image
      },
      slug,
      body
    }
  `;

  const posts = await sanityClient.fetch(query);

  console.log(posts);
  return {
    props: {
      posts: posts,
    },
  };
};

export default Home;
