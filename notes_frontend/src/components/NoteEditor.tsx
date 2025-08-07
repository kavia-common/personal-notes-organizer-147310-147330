import { component$, useSignal, useTask$ } from "@builder.io/qwik";

type Note = {
  id?: string | undefined;
  title: string;
  content: string;
};

interface NoteEditorProps {
  note?: Note;
  onSave$: (n: Note & { updated_at?: string }) => void;
  onCancel$: () => void;
}

// PUBLIC_INTERFACE
export const NoteEditor = component$((props: NoteEditorProps) => {
  const title = useSignal(props.note?.title ?? "");
  const content = useSignal(props.note?.content ?? "");

  useTask$(({ track }) => {
    track(() => props.note);
    title.value = props.note?.title ?? "";
    content.value = props.note?.content ?? "";
  });

  return (
    <div class="note-editor-panel" aria-label="Edit note">
      <h2>{props.note?.id ? "Edit Note" : "New Note"}</h2>
      <form
        onSubmit$={(ev) => {
          ev.preventDefault();
          if (content.value.trim().length === 0) return;
          // Call the provided onSave$ handler with the updated note
          props.onSave$({
            ...props.note,
            title: title.value.trim(),
            content: content.value.trim(),
          });
        }}
      >
        <input
          class="editor-title"
          type="text"
          placeholder="Title"
          autoFocus
          value={title.value}
          onInput$={(ev) => (title.value = (ev.target as HTMLInputElement).value)}
          aria-label="Note title"
        />
        <textarea
          class="editor-content"
          placeholder="Write your note here…"
          required
          value={content.value}
          onInput$={(ev) => (content.value = (ev.target as HTMLTextAreaElement).value)}
          aria-label="Note content"
          rows={8}
        ></textarea>
        <div class="editor-actions">
          <button type="submit" class="save-btn">
            Save
          </button>
          <button
            type="button"
            class="cancel-btn"
            onClick$={props.onCancel$}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
});
