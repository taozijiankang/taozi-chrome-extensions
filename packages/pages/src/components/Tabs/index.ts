export interface TabItem {
  label: string;
  value: string;
  isDot?: boolean;
  badgeCount?: number;
  slot?: string;
  click?: () => void;
}
