declare interface DecodedTokenMetadata {
  iat: number;
  exp: number;
}

declare interface DecodedToken extends DecodedTokenMetadata {
  username: string;
  id: number;
}

declare namespace Express {
  export interface Request {
    user?: DecodedToken;
  }
}
