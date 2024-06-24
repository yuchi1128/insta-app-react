export interface File extends Blob {
    readonly lasModified: number;
    readonly name: string;
}

export interface PROPS_AUTHEN {
    email: string;
    password: string;
}

export interface PROPS_PROFILE {
    id: number;
    nickName: string;
    img: File | null;
}

export interface PROPS_NICKNAME {
    nickName: string;
}

export interface PROPS_NEWPOST {
  title: string;
  img: File | null;
}
export interface PROPS_LIKED {
  id: number;
  title: string;
  current: number[];
  new: number;
}
export interface PROPS_COMMENT {
  text: string;
  post: number;
}

export interface PROPS_POST {
  postId: number;
  loginId: number;
  userPost: number;
  title: string;
  imageUrl: string;
  liked: number[];
}