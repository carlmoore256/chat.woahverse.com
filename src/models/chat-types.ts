export interface IChatSession {
    id? : string;
    userId : string;
    createdAt? : Date;
    title? : string | null;
    numMessages? : number;
}

export interface IChatMessage {
    id : string;
    message : string;
    role : string;
    createdAt : Date;
    code? : string;
}
