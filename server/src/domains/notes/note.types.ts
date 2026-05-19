export type NoteResponse = {
  id: string;
  articleId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UpsertArticleNoteInput = {
  articleId: string;
  content: string;
};

export type UpdateNoteInput = {
  noteId: string;
  content: string;
};
