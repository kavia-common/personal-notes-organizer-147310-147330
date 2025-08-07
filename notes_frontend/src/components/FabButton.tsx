// FabButton provides a floating "add note" button.
import { component$ } from "@builder.io/qwik";

// PUBLIC_INTERFACE
export const FabButton = component$((props: { onClick$: () => void }) => {
  return (
    <button
      class="fab-btn"
      aria-label="Add new note"
      type="button"
      onClick$={props.onClick$}
    >
      ＋
    </button>
  );
});
