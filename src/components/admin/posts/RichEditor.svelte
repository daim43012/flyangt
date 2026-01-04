<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import Link from "@tiptap/extension-link";
  import Placeholder from "@tiptap/extension-placeholder";

  import { Table } from "@tiptap/extension-table";
  import { TableRow } from "@tiptap/extension-table-row";
  import { TableHeader } from "@tiptap/extension-table-header";
  import { TableCell } from "@tiptap/extension-table-cell";

  import Image from "@tiptap/extension-image";
  import Youtube from "@tiptap/extension-youtube";

  export let value: any = null;
  export let onChange: (json: any) => void;

  let editorEl: HTMLDivElement;
  let editor: Editor | null = null;

  let tableHint = "";
  let uploadingImage = false;

  const emptyDoc = {
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }],
  };
  async function uploadMany(files: FileList) {
    if (!editor) return;

    const list = Array.from(files);
    if (!list.length) return;

    uploadingImage = true;
    try {
      for (const file of list) {
        const url = await uploadFile(file);
        editor.chain().focus().setImage({ src: url }).run();
      }
      setHint(`Inserted ${list.length} image(s) ✅`);
    } catch (err: any) {
      alert(err?.message ?? "Upload error");
    } finally {
      uploadingImage = false;
    }
  }

  function setHint(msg: string) {
    tableHint = msg;
    if (msg) setTimeout(() => (tableHint = ""), 2500);
  }

  function setLink() {
    if (!editor) return;
    const url = prompt("Paste link URL:");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function unsetLink() {
    editor?.chain().focus().unsetLink().run();
  }

  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    return data.url as string;
  }

  function insertImageByUrl() {
    if (!editor) return;
    const url = prompt("Paste image URL (or /media/...):");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }

  async function onImageFileChange(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    await uploadMany(files);

    input.value = "";
  }

  function insertYoutube() {
    if (!editor) return;
    const url = prompt("Paste YouTube link:");
    if (!url) return;

    editor.commands.setYoutubeVideo({
      src: url,
      width: 860,
      height: 485,
    });
  }

  function focusIntoAnyExistingTable(): boolean {
    if (!editor) return false;
    if (editor.isActive("table")) return true;

    const { doc } = editor.state;
    let tablePos: number | null = null;

    doc.descendants((node, pos) => {
      if (node.type.name === "table" && tablePos === null) {
        tablePos = pos;
        return false;
      }
      return true;
    });

    if (tablePos === null) return false;

    editor.commands.setTextSelection(tablePos + 1);
    editor.commands.focus();
    return true;
  }

  function ensureTableFocusOrExplain(): boolean {
    if (!editor) return false;

    if (editor.isActive("table")) return true;

    if (focusIntoAnyExistingTable()) {
      setHint("Focused the first table. Now you can edit rows/cols.");
      return true;
    }

    setHint("Create a table first (press + Table), then click inside a cell.");
    return false;
  }

  function insertTable() {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
    setHint("Table inserted. Click a cell to edit rows/cols.");
  }

  function addRowAfter() {
    if (!editor) return;
    if (!ensureTableFocusOrExplain()) return;
    editor.chain().focus().addRowAfter().run();
  }

  function addColumnAfter() {
    if (!editor) return;
    if (!ensureTableFocusOrExplain()) return;
    editor.chain().focus().addColumnAfter().run();
  }

  function deleteRow() {
    if (!editor) return;
    if (!ensureTableFocusOrExplain()) return;
    editor.chain().focus().deleteRow().run();
  }

  function deleteColumn() {
    if (!editor) return;
    if (!ensureTableFocusOrExplain()) return;
    editor.chain().focus().deleteColumn().run();
  }

  function deleteTable() {
    if (!editor) return;
    if (!ensureTableFocusOrExplain()) return;
    editor.chain().focus().deleteTable().run();
  }

  onMount(() => {
    editor = new Editor({
      element: editorEl,
      extensions: [
        StarterKit,
        Link.configure({ openOnClick: false }),
        Placeholder.configure({ placeholder: "Write your post..." }),

        Image.configure({ allowBase64: false }),
        Youtube.configure({
          controls: true,
          nocookie: false,
        }),

        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
      ],
      content: value ?? emptyDoc,
      onUpdate: ({ editor }) => onChange?.(editor.getJSON()),
    });

    onChange?.(editor.getJSON());
  });

  onDestroy(() => editor?.destroy());

  $: inTable = Boolean(editor?.isActive("table"));
</script>

<div class="toolbar">
  <button
    type="button"
    class:active={editor?.isActive("bold")}
    on:click={() => editor?.chain().focus().toggleBold().run()}
  >
    B
  </button>

  <button
    type="button"
    class:active={editor?.isActive("heading", { level: 2 })}
    on:click={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
  >
    H2
  </button>

  <button
    type="button"
    class:active={editor?.isActive("heading", { level: 3 })}
    on:click={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
  >
    H3
  </button>

  <button
    type="button"
    on:click={() => editor?.chain().focus().toggleBulletList().run()}
  >
    • List
  </button>

  <button type="button" on:click={setLink}>Link</button>
  <button type="button" on:click={unsetLink}>Unlink</button>

  <div class="divider"></div>

  <button type="button" on:click={insertImageByUrl}>Image</button>

  <label class="fileBtn">
    Upload images
    <input
      type="file"
      accept="image/*"
      multiple
      on:change={onImageFileChange}
    />
  </label>

  <button type="button" on:click={insertYoutube}>Video</button>

  <div class="divider"></div>

  <button type="button" on:click={insertTable}>+ Table</button>

  <button
    type="button"
    on:click={addRowAfter}
    class:softDisabled={!inTable}
    title={!inTable
      ? "Click inside a table cell to edit rows"
      : "Add row after"}
  >
    + Row
  </button>

  <button
    type="button"
    on:click={addColumnAfter}
    class:softDisabled={!inTable}
    title={!inTable
      ? "Click inside a table cell to edit columns"
      : "Add column after"}
  >
    + Col
  </button>

  <button
    type="button"
    on:click={deleteRow}
    class:softDisabled={!inTable}
    title={!inTable
      ? "Click inside a table cell to edit rows"
      : "Delete current row"}
  >
    − Row
  </button>

  <button
    type="button"
    on:click={deleteColumn}
    class:softDisabled={!inTable}
    title={!inTable
      ? "Click inside a table cell to edit columns"
      : "Delete current column"}
  >
    − Col
  </button>

  <button
    type="button"
    on:click={deleteTable}
    class:softDisabled={!inTable}
    title={!inTable
      ? "Click inside a table cell to delete a table"
      : "Delete table"}
  >
    Delete table
  </button>

  <div class="spacer"></div>

  <button
    type="button"
    class="secondary"
    on:click={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}
  >
    Clear formatting
  </button>
</div>

{#if uploadingImage}
  <div class="hint live">Uploading image…</div>
{/if}

{#if !inTable}
  <div class="hint">
    Tip: click inside a table cell to enable row/column actions.
  </div>
{/if}

{#if tableHint}
  <div class="hint live">{tableHint}</div>
{/if}

<div class="editor" bind:this={editorEl}></div>

<style>
  .toolbar {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin: 0 0 10px;
    align-items: center;
  }

  .toolbar button,
  .fileBtn {
    border: 1px solid rgba(1, 34, 69, 0.2);
    background: #fff;
    padding: 8px 10px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 700;
    color: #012245;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .fileBtn input {
    display: none;
  }

  .toolbar button.active {
    background: rgba(1, 34, 69, 0.08);
    border-color: rgba(1, 34, 69, 0.35);
  }

  .toolbar button.softDisabled {
    opacity: 0.55;
  }

  .toolbar .secondary {
    font-weight: 600;
    opacity: 0.9;
  }

  .divider {
    width: 1px;
    height: 22px;
    background: rgba(0, 0, 0, 0.12);
    margin: 0 4px;
  }

  .spacer {
    flex: 1;
  }

  .hint {
    margin: 0 0 10px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.55);
  }

  .hint.live {
    color: rgba(1, 34, 69, 0.85);
    font-weight: 700;
  }

  .editor {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 14px;
    padding: 14px;
    min-height: 320px;
    background: #fff;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
    font-family: var(--cc-font-family);
  }

  .editor :global(p) {
    margin: 0 0 12px;
    font-size: 16px;
    line-height: 1.7;
    color: #111;
  }

  .editor :global(a) {
    color: #012245;
    text-decoration: underline;
  }

  /* ✅ Images (we will render them as a gallery by CSS on viewer too) */
  .editor :global(img) {
    max-width: 100%;
    height: auto;
    border-radius: 14px;
    display: block;
    margin: 12px 0;
  }

  /* ✅ YouTube iframe styling */
  .editor :global(.youtube) {
    margin: 14px 0;
    border-radius: 14px;
    overflow: hidden;
  }

  /* ✅ Table styles */
  .editor :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.12);
  }

  .editor :global(th),
  .editor :global(td) {
    border: 1px solid rgba(0, 0, 0, 0.12);
    padding: 10px;
    vertical-align: top;
    font-size: 14px;
  }

  .editor :global(th) {
    background: rgba(1, 34, 69, 0.06);
    font-weight: 800;
    color: #012245;
  }

  .editor :global(.selectedCell) {
    outline: 2px solid rgba(1, 34, 69, 0.35);
    outline-offset: -2px;
  }
</style>
