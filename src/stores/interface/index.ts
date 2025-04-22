export type LanguageType = "zh" | "en" | null;
export interface User {
  auth: number
  authMsg: string
  avatar: string
  background: string
  coin: number
  createDate: string
  description: string
  exp: number
  nickname: string
  sex: number
  uid: number
  username: string
  vip: number
}
