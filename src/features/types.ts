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

export interface PROPS_NIKCNAME {
    nickName: string;
}