interface IResultModal {
  isOpen: boolean;
  onOpenChange: () => void;
  isSuccess: boolean;
  successContent: string;
  onAction?: () => void;
}
