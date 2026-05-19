import type { Request, Response } from 'express';

import {
  deleteNote,
  getArticleNote,
  updateNote,
  upsertArticleNote,
} from './note.service.js';
import type { NoteResponse } from './note.types.js';
import type { SuccessResponse } from '../articles/article.types.js';
import { AppError } from '../../middlewares/error.middleware.js';

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

function getAuthenticatedUserId(request: Request) {
  if (!request.user) {
    throw new AppError(401, 'Authentication is required');
  }

  return request.user.id;
}

export async function handleGetArticleNote(
  request: Request<ArticleNoteParams>,
  response: Response<SuccessResponse<NoteResponse>>,
) {
  const note = await getArticleNote(
    getAuthenticatedUserId(request),
    request.params.articleId,
  );

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
    userId: getAuthenticatedUserId(request),
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
    userId: getAuthenticatedUserId(request),
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
  await deleteNote(getAuthenticatedUserId(request), request.params.noteId);

  response.status(200).json({
    success: true,
    data: {
      deleted: true,
    },
  });
}
