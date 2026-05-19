export type NoteResponse = {
  id: string;
  articleId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UpsertArticleNoteInput = {
  userId: string;
  articleId: string;
  content: string;
};

export type UpdateNoteInput = {
  userId: string;
  noteId: string;
  content: string;
};
