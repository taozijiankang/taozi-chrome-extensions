import { useLocalStorage } from "./index";

export interface MpReleasePlanLocalStorage {
  mpList?: {
    appId: string;
    name: string;
    headimg: string;
    username: string;
    email: string;
    type: string;
  }[];
}

export const mpReleasePlanLocalStorage = useLocalStorage<string, MpReleasePlanLocalStorage>("mp-release-plan-local-storage", {
  mpList: [],
});
