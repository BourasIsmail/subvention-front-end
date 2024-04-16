import { Deleguation } from "./demande";

export type UserInfo = {
  id?: number | undefined;
  name?: string | undefined;
  email?: string | undefined;
  roles?: string | undefined;
  password?: string | undefined;
  deleguation?: Deleguation | undefined;
};
