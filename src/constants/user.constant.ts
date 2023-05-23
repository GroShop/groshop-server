const USER = {
  SOCIAL: "social",
  GOOGLE: "google",
  FACEBOOK: "facebook",
  RESET_PASSWORD: "Reset Your Password",
  FORGET_PASSWORD: "Forget Password",
};


export enum ROLE {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum ACTION_TYPE {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export const USER_HIDDEN_FIELDS = {
  password: 0,
};

export default USER;
