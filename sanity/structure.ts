import type { StructureResolver, StructureBuilder } from 'sanity/desk'

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items(S.documentTypeListItems())
