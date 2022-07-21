import React, { useState } from "react";
import PortableText from "react-portable-text";
import Header from "../../components/Header/Header";
import { sanityClient, urlFor } from "../../sanity";
import { CommentResponseType, Posts } from "../../typings";
import { useForm, SubmitHandler } from "react-hook-form";

interface Props {
  post: Posts;
}

interface IFormProps {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface ISubmitComment {
  status: string;
}

function Post(props: Props) {
  const { post } = props;

  const [submitted, setSubmitted] = useState<ISubmitComment>({
    status: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormProps>();

  const onSubmit: SubmitHandler<IFormProps> = (data) => {
    setSubmitted({ status: "loading" });
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((res: CommentResponseType) => {
        if (res.err == false) {
          setSubmitted({ status: "success" });
        }
      })
      .catch((err) => {
        setSubmitted({ status: "error" });
      });
  };

  console.log(post);
  return (
    <>
      <Header />
      <div className="post-banner h-60 bg-gray-100 mb-10">
        {post.mainImage ? (
          <img
            className="h-60 w-full object-cover"
            src={urlFor(post.mainImage).url()}
          />
        ) : null}
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-4xl">{post.title}</h1>
          <div className="flex items-center space-x-4">
            <p>By {post.author.name} </p>
            <img
              className="w-6 h-6 rounded-full"
              src={urlFor(post.author.image).url()!}
            />
            <p className="text-gray-600">
              {new Date(post._createdAt).toLocaleString()}
            </p>
          </div>

          <div className="border my-5" />

          <PortableText
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            //@ts-ignore: Unreachable code error
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="text-xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />

          <div className="border my-5" />
          <div>
            <h1 className="text-xl mb-5">Comments:</h1>
            <ul>
              {post.comments.map((comment) => (
                <li>
                  <div className="flex space-x-2 items-center">
                    <div className="w-10 h-10 flex items-center border rounded-full justify-center">
                      {comment.name[0]}
                    </div>
                    <div>
                      <p className="text-gray-600">{comment.comment} </p>
                      <p className="text-xs text-gray-400">
                        {new Date(comment._createdAt).toLocaleString()} by{" "}
                        {comment.email}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="comment flex flex-col max-w-3xl mx-auto border space-y-5 p-4 rounded-lg"
          >
            <input type="hidden" value={post._id} {...register("_id")} />

            <div className="flex flex-col">
              <label className="text-gray-500">Name</label>
              <input
                className="mt-1 p-2 border focus:border-yellow-500 focus:outline-none"
                type="text"
                placeholder="John Doe"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">Name is required</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-500">Email</label>
              <input
                className="mt-1 p-2 border focus:border-yellow-500 focus:outline-none"
                type="email"
                placeholder="ash@ash.com"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">Email is required</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-500">Comment</label>
              <textarea
                className="mt-1 p-2 border focus:border-yellow-500 focus:outline-none"
                rows={8}
                {...register("comment", { required: true })}
                placeholder="Write your Comment!"
              ></textarea>
              {errors.comment && (
                <p className="text-red-500 text-sm">Comment is required</p>
              )}
            </div>

            {submitted.status === "success" ? (
              <button className="bg-yellow-500 p-2 font-bold text-white">
                Thank You for your comment
              </button>
            ) : submitted.status == "loading" ? (
              <button className="shadow bg-slate-200 p-2 font-bold text-white animate-pulse">
                Submitting
              </button>
            ) : submitted.status === "error" ? (
              <button className="bg-red-500 p-2 font-bold text-white">
                Error Submitting comment!!
              </button>
            ) : (
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 p-2 font-bold text-white"
              >
                Submit
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const query = `
        *[_type == "post"]{
            _id,
            _createdAt,
            title,
            slug
    }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Posts) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths: [],
    fallback: "blocking", // false or 'blocking'
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const query = `
            *[_type == "post" && slug.current == $slug][0]{
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
                body,
                "comments": *[
                  _type == "comment" &&
                  post._ref == ^._id &&
                  approved == true
                ],
        }`;

  const post = await sanityClient.fetch(query, {
    slug: params.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post: post,
    },
    revalidate: 60,
  };
}

export default Post;
