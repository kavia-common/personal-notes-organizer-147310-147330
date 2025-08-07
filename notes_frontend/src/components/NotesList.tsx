import { component$, $ } from "@builder.io/qwik";
import { NoteCard } from "./NoteCard";

type Note = {
  id: string;
  title: string;
  content: string;
  updated_at: string;
};

interface NotesListProps {
  notes: Note[];
  searchTerm: string;
  setSearchTerm$: (term: string) => void;
  onEdit$: (note: Note) => void;
  onDelete$: (note: Note) => void;
  onSelect$: (note: Note) => void;
  selectedId: string | null;
}

export const NotesList = component$(
  ({
    notes,
    searchTerm,
    setSearchTerm$,
    onEdit$,
    onDelete$,
    onSelect$,
    selectedId,
  }: NotesListProps) => {
    return (
      <section class="notes-list-section" aria-label="Notes list">
        <div class="notes-list-toolbar">
          <input
            class="search-bar"
            type="text"
            placeholder="Search notes…"
            value={searchTerm}
            onInput$={$((ev) => setSearchTerm$((ev.target as HTMLInputElement).value))}
            aria-label="Search notes"
          />
        </div>
        <div class="notes-list-grid">
          {notes.length === 0 && (
            <div class="empty-state">No notes found.</div>
          )}
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              selected={selectedId === note.id}
              onEdit$={$(() => onEdit$(note))}
              onDelete$={$(() => onDelete$(note))}
              onSelect$={$(() => onSelect$(note))}
            />
          ))}
        </div>
      </section>
    );
  }
);
