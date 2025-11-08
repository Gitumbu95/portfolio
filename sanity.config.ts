'use client'

import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'          // ✅ correct for Sanity v4
import { visionTool } from '@sanity/vision'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    deskTool({ structure }),                    // ✅ use deskTool instead of structureTool
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
