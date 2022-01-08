export interface ModalProps<T> {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose?: () => void;
  onSubmit?: (data: T) => void;
  data: T;
}
