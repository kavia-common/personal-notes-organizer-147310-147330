import { component$, useSignal } from "@builder.io/qwik";

type Note = {
  id: string;
  title: string;
  content: string;
  updated_at: string;
};

// PUBLIC_INTERFACE
export const NoteCard = component$(
  ({
    note,
    onEdit$,
    onDelete$,
    onSelect$,
    selected,
  }: {
    note: Note;
    onEdit$: () => void;
    onDelete$: () => void;
    onSelect$: () => void;
    selected: boolean;
  }) => {
    const confirmDelete = useSignal(false);

    return (
      <div
        class={["note-card", selected && "note-card-selected"]}
        tabIndex={0}
        onClick$={onSelect$}
        aria-selected={selected}
      >
        <div class="note-card-header">
          <h2 class="note-title">{note.title || <em>Untitled</em>}</h2>
          <div class="note-card-actions">
            <button
              type="button"
              class="icon-btn edit-btn"
              aria-label="Edit note"
              onClick$={(e) => {
                e.stopPropagation();
                onEdit$();
              }}
            >
              ✏️
            </button>
            <button
              type="button"
              class="icon-btn delete-btn"
              aria-label="Delete note"
              onClick$={(e) => {
                e.stopPropagation();
                confirmDelete.value = true;
              }}
            >
              🗑
            </button>
          </div>
        </div>
        <p class="note-content">
          {note.content.length > 100
            ? note.content.substring(0, 100) + "…"
            : note.content}
        </p>
        <div class="note-updated">{new Date(note.updated_at).toLocaleString()}</div>
        {confirmDelete.value && (
          <div class="delete-confirm">
            <span>Delete this note?</span>
            <button
              class="confirm-btn"
              onClick$={() => {
                onDelete$();
                confirmDelete.value = false;
              }}
            >
              Yes
            </button>
            <button
              class="cancel-btn"
              onClick$={() => (confirmDelete.value = false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }
);
