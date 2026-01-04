export interface TabItem {
  label: string;
  value: string;
  alert?: boolean;
  slot?: string;
  click?: () => void;
}
