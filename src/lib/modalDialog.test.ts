import { describe, expect, it, vi } from "vitest";
import {
  closeModalDialog,
  restoreDialogTrigger,
  showModalDialog,
} from "./modalDialog";

function createDialog({ connected = true, open = false } = {}) {
  const dialog = {
    isConnected: connected,
    open,
    showModal: vi.fn(() => {
      dialog.open = true;
    }),
    close: vi.fn(() => {
      dialog.open = false;
    }),
  };

  return dialog;
}

describe("showModalDialog", () => {
  it("promotes a connected dialog to the modal top layer only once", () => {
    const dialog = createDialog();

    expect(showModalDialog(dialog)).toBe(true);
    expect(showModalDialog(dialog)).toBe(false);
    expect(dialog.showModal).toHaveBeenCalledTimes(1);
  });

  it("ignores a dialog removed before its deferred open runs", () => {
    const dialog = createDialog({ connected: false });

    expect(showModalDialog(dialog)).toBe(false);
    expect(dialog.showModal).not.toHaveBeenCalled();
  });
});

describe("closeModalDialog", () => {
  it("only closes a dialog that is still open", () => {
    const dialog = createDialog({ open: true });

    expect(closeModalDialog(dialog)).toBe(true);
    expect(closeModalDialog(dialog)).toBe(false);
    expect(dialog.close).toHaveBeenCalledTimes(1);
  });
});

describe("restoreDialogTrigger", () => {
  it("returns focus to the exact connected trigger", () => {
    const trigger = { isConnected: true, focus: vi.fn() };

    expect(restoreDialogTrigger(trigger)).toBe(true);
    expect(trigger.focus).toHaveBeenCalledTimes(1);
  });

  it("does not focus a trigger that has left the document", () => {
    const trigger = { isConnected: false, focus: vi.fn() };

    expect(restoreDialogTrigger(trigger)).toBe(false);
    expect(trigger.focus).not.toHaveBeenCalled();
  });
});
