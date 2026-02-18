import { HiExclamation, HiTrash, HiQuestionMarkCircle } from 'react-icons/hi';
import Modal from './Modal';
import Button from './Button';

const icons = {
  danger: HiTrash,
  warning: HiExclamation,
  info: HiQuestionMarkCircle,
};

const iconStyles = {
  danger: { bg: 'bg-rose-50', text: 'text-rose-600' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-600' },
  info: { bg: 'bg-blue-50', text: 'text-blue-600' },
};

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  const Icon = icons[variant] || icons.info;
  const styles = iconStyles[variant] || iconStyles.info;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="text-center">
        {/* Icon */}
        <div className="mx-auto mb-4 flex items-center justify-center">
          <div className={`p-3 rounded-lg ${styles.bg}`}>
            <Icon className={`w-7 h-7 ${styles.text}`} />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">{title}</h3>

        {/* Message */}
        <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="min-w-[100px]"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            loading={loading}
            className="min-w-[100px]"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
