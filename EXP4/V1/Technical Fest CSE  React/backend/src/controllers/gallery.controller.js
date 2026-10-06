import { GalleryItem } from '../models/index.js';
import { makeCrud } from './crud.js';

export const { list, getOne, create, update, remove } = makeCrud(GalleryItem, {
  label: 'Gallery item',
  sort: { order: 1, createdAt: 1 },
  activeField: 'isPublished',
  includeParam: 'includeUnpublished',
  filterFromQuery: (q) => (q.edition ? { edition: q.edition } : {}),
});
