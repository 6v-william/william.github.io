import { extend } from "umi-request";

export function getRequestExtend() {
  const token = localStorage.getItem('fly_user_token');
  console.log(token, 333)

  return extend({
    headers: {
      ...token ? { "fly_user_token": token } : undefined,
    },
  });
}