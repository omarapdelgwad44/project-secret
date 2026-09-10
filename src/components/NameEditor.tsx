import { Pencil } from "lucide-react";
import { FormEvent, useEffect, useId, useState } from "react";
import { BIRTHDAY_NAME } from "../constants";

type NameEditorProps = {
  name: string;
  onChange: (name: string) => void;
};

export function NameEditor({ name, onChange }: NameEditorProps) {
  const dialogId = useId();
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(name);

  useEffect(() => {
    if (open) setDraft(name);
  }, [name, open]);

  const save = (event: FormEvent) => {
    event.preventDefault();
    const next = draft.trim() || BIRTHDAY_NAME;
    onChange(next);
    setOpen(false);
  };

  return (
    <div className="name-editor">
      <p className="for-line">
        for <span>{name}</span>
      </p>
      <button
        type="button"
        className="icon-btn"
        aria-label="Edit birthday name"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => setOpen((value) => !value)}
      >
        <Pencil size={14} strokeWidth={1.8} />
      </button>
      {open ? (
        <form id={dialogId} className="name-popover" onSubmit={save}>
          <label htmlFor={inputId} className="sr-only">
            Birthday name
          </label>
          <input
            id={inputId}
            value={draft}
            maxLength={24}
            autoComplete="off"
            autoFocus
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button type="submit" className="save-name">
            Save
          </button>
        </form>
      ) : null}
    </div>
  );
}
