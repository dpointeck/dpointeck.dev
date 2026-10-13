import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { expect, it, vi } from 'vitest'
import { getPostBySlug, getPostsByYear } from './post'

it('loads YAML frontmatter, preserves dates, and excludes drafts', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'blog-posts-'))
  const cwd = vi.spyOn(process, 'cwd').mockReturnValue(directory)

  try {
    await mkdir(path.join(directory, '_posts'))
    await writeFile(
      path.join(directory, '_posts', 'older.md'),
      `---
slug: older
title: 'Older: post'
date: 2024-12-31
metadesc: A description
---

Some **Markdown**.
`,
    )
    await writeFile(
      path.join(directory, '_posts', 'newer.md'),
      `---
slug: newer
title: Newer post
date: '2025-01-02'
metadesc: Another description
published: true
---
New content.
`,
    )
    await writeFile(
      path.join(directory, '_posts', 'draft.md'),
      `---
slug: draft
title: Draft
date: 2026-03-04
metadesc: Not published
published: false
---
Hidden content.
`,
    )

    const years = await getPostsByYear()
    expect(
      years.map(({ year, posts }) => ({
        year,
        posts: posts.map(({ slug, rawDate }) => ({ slug, rawDate })),
      })),
    ).toEqual([
      { year: 2025, posts: [{ slug: 'newer', rawDate: '2025-01-02' }] },
      { year: 2024, posts: [{ slug: 'older', rawDate: '2024-12-31' }] },
    ])
    expect(await getPostBySlug('older')).toEqual({
      slug: 'older',
      title: 'Older: post',
      metadesc: 'A description',
      content: '<p>Some <strong>Markdown</strong>.</p>',
    })
  } finally {
    cwd.mockRestore()
    await rm(directory, { recursive: true, force: true })
  }
})
