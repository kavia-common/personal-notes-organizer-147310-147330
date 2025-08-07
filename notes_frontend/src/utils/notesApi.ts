const API_BASE = "/api/notes";

// You may need to update API_BASE if integrating with an external container/service.
// These are placeholders; adapt as needed for actual API endpoints.

export async function getNotes(): Promise<Array<any>> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

export async function createNote(note: { title: string; content: string }): Promise<any> {
  const res = await fetch(API_BASE, {
    method: "POST",
    body: JSON.stringify(note),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
}

export async function updateNote(note: { id: string; title: string; content: string }): Promise<any> {
  const res = await fetch(`${API_BASE}/${note.id}`, {
    method: "PUT",
    body: JSON.stringify(note),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
}

export async function deleteNote(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete note");
}
