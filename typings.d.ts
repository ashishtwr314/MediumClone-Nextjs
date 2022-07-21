export interface Posts {
  _id: string;
  _createdAt: string;
  author: {
    name: string;
    image: object;
  };
  mainImage: object;
  title: string;
  slug: {
    current: string;
  };
  body: object;
  comments: [Comment];
}

export interface Comment {
  _id: string;
  _createdAt: string;
  approved: Boolean;
  comment: string;
  email: string;
  name: string;
  post: {
    _ref: string;
  };
}

export interface CommentResponseType {
  err: Boolean;
  message: string;
}
