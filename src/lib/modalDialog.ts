interface ModalDialogLike {
  readonly isConnected: boolean;
  readonly open: boolean;
  showModal(): void;
  close(): void;
}

interface FocusTargetLike {
  readonly isConnected: boolean;
  focus(): void;
}

export function showModalDialog(dialog: ModalDialogLike | null): boolean {
  if (!dialog || !dialog.isConnected || dialog.open) return false;

  dialog.showModal();
  return true;
}

export function closeModalDialog(dialog: ModalDialogLike | null): boolean {
  if (!dialog?.open) return false;

  dialog.close();
  return true;
}

export function restoreDialogTrigger(trigger: FocusTargetLike | null): boolean {
  if (!trigger?.isConnected) return false;

  trigger.focus();
  return true;
}
