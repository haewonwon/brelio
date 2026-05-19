import type { Request, Response } from 'express';

import {
  deleteNote,
  getArticleNote,
  updateNote,
  upsertArticleNote,
} from './note.service.js';
import type { NoteResponse } from './note.types.js';
import type { SuccessResponse } from '../articles/article.types.js';

type ArticleNoteParams = {
  articleId: string;
};

type NoteParams = {
  noteId: string;
};

type NoteBody = {
  content: string;
};

type DeleteNoteResponse = {
  deleted: true;
};

export async function handleGetArticleNote(
  request: Request<ArticleNoteParams>,
  response: Response<SuccessResponse<NoteResponse>>,
) {
  const note = await getArticleNote(request.params.articleId);

  response.status(200).json({
    success: true,
    data: note,
  });
}

export async function handleUpsertArticleNote(
  request: Request<ArticleNoteParams, unknown, NoteBody>,
  response: Response<SuccessResponse<NoteResponse>>,
) {
  const note = await upsertArticleNote({
    articleId: request.params.articleId,
    content: request.body.content,
  });

  response.status(200).json({
    success: true,
    data: note,
  });
}

export async function handleUpdateNote(
  request: Request<NoteParams, unknown, NoteBody>,
  response: Response<SuccessResponse<NoteResponse>>,
) {
  const note = await updateNote({
    noteId: request.params.noteId,
    content: request.body.content,
  });

  response.status(200).json({
    success: true,
    data: note,
  });
}

export async function handleDeleteNote(
  request: Request<NoteParams>,
  response: Response<SuccessResponse<DeleteNoteResponse>>,
) {
  await deleteNote(request.params.noteId);

  response.status(200).json({
    success: true,
    data: {
      deleted: true,
    },
  });
}
