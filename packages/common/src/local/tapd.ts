import { useLocalStorage } from ".";

export interface TapdWorkitem {
  name: string;
  detail_url: string;
  priority_name: string;
  entity_type: string;
  short_id: string;
  workspace_name: string;
  status_alias: string;
}

export interface TapdLocalStorage {
  loading?: boolean;
  workitemCount?: {
    story: number;
    task: number;
    bug: number;
  };
  viewConfig?: {
    current_tab: string;
  };
  workitemList?: TapdWorkitem[];
  toBeReleasedBugIds?: string[];
  dataUpdateTime?: number;
  errMsg?: string;
}

export const tapdLocalStorage = useLocalStorage<string, TapdLocalStorage>("tapd-local-storage", {
  loading: false,
  workitemCount: {
    story: 0,
    task: 0,
    bug: 0
  },
  viewConfig: {
    current_tab: ""
  },
  workitemList: [],
  toBeReleasedBugIds: []
});
