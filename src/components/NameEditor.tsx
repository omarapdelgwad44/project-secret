type NameEditorProps = {
  name: string;
};

export function NameEditor({ name }: NameEditorProps) {
  return (
    <p className="for-line">
      for <span>{name}</span>
    </p>
  );
}
