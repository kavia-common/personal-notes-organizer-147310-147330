import { component$, useStore, useTask$, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { NotesList } from "../components/NotesList";
import { NoteEditor } from "../components/NoteEditor";
import { FabButton } from "../components/FabButton";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../utils/notesApi";

// Type representing a single note
type Note = {
  id: string;
  title: string;
  content: string;
  updated_at: string;
};
// Store for app state
interface AppState {
  notes: Note[];
  searchTerm: string;
  loading: boolean;
  error: string | null;
  editingNote: Note | null;
  editorOpen: boolean;
  selectedId: string | null;
}

export default component$(() => {
  const state = useStore<AppState>({
    notes: [],
    searchTerm: "",
    loading: false,
    error: null,
    editingNote: null,
    editorOpen: false,
    selectedId: null,
  });
  const modalBackdrop = useSignal(false);

  // Fetch notes initially and on reload
  useTask$(async () => {
    state.loading = true;
    state.error = null;
    try {
      const data = await getNotes();
      state.notes = data.sort(
        (a: Note, b: Note) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    } catch (err: any) {
      state.error = "Could not load notes";
    }
    state.loading = false;
  });

  // Filtered notes for search
  const filteredNotes = () => {
    if (!state.searchTerm.trim()) return state.notes;
    const str = state.searchTerm.trim().toLowerCase();
    return state.notes.filter(
      (n) =>
        n.title.toLowerCase().includes(str) ||
        n.content.toLowerCase().includes(str)
    );
  };

  // Note sandbox for creation/editing
  const handleEdit = $((note: Note) => {
    state.editingNote = note;
    state.editorOpen = true;
    modalBackdrop.value = true;
  });
  const handleCreate = $(() => {
    state.editingNote = { title: "", content: "" } as Note;
    state.editorOpen = true;
    modalBackdrop.value = true;
  });
  const handleCancel = $(() => {
    state.editingNote = null;
    state.editorOpen = false;
    modalBackdrop.value = false;
  });
  const handleSave = $(async (noteData: Note) => {
    state.loading = true;
    try {
      if (noteData.id) {
        await updateNote(noteData);
      } else {
        await createNote(noteData);
      }
      // Reload notes
      const data = await getNotes();
      state.notes = data.sort(
        (a: Note, b: Note) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      state.error = null;
    } catch (err: any) {
      state.error = noteData.id
        ? "Could not update note"
        : "Could not create note";
    }
    state.editingNote = null;
    state.editorOpen = false;
    modalBackdrop.value = false;
    state.loading = false;
  });
  const handleDelete = $(async (note: Note) => {
    state.loading = true;
    try {
      await deleteNote(note.id);
      state.notes = state.notes.filter((n) => n.id !== note.id);
      if (state.selectedId === note.id) state.selectedId = null;
      state.error = null;
    } catch (err: any) {
      state.error = "Could not delete note";
    }
    state.loading = false;
  });
  const handleSelect = $((note: Note) => {
    state.selectedId = note.id;
  });

  const setSearchTerm = $((term: string) => {
    state.searchTerm = term;
  });

  return (
    <div class="notes-main-layout">
      <header class="header-bar">
        <span class="header-bar-title">Notes</span>
        <span></span>
      </header>

      <main style="flex:1">
        {state.error && (
          <div
            style={{
              color: "#b91c1c",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              margin: "1em auto",
              maxWidth: "480px",
              padding: "0.8em 1.5em",
              borderRadius: "10px",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            {state.error}
          </div>
        )}
        {state.loading && (
          <div
            style={{
              color: "#4F46E5",
              fontWeight: 600,
              textAlign: "center",
              marginTop: "2em",
            }}
          >
            Loading…
          </div>
        )}
        {!state.loading && (
          <NotesList
            notes={filteredNotes()}
            searchTerm={state.searchTerm}
            setSearchTerm$={setSearchTerm}
            onEdit$={handleEdit}
            onDelete$={handleDelete}
            onSelect$={handleSelect}
            selectedId={state.selectedId}
          />
        )}
        <FabButton onClick$={handleCreate} />
        {state.editorOpen && (
          <>
            <div class="notes-app-modal-backdrop" onClick$={handleCancel} />
            <NoteEditor
              note={state.editingNote ?? undefined}
              onSave$={(noteData) => {
                // the handler should be sync for NoteEditor, so just "void" the async call
                void handleSave(noteData);
              }}
              onCancel$={handleCancel}
            />
          </>
        )}
      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Notes",
  meta: [
    {
      name: "description",
      content: "A personal notes app built with Qwik. Create, edit, search, and manage notes easily.",
    },
  ],
};
