import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '../components/PageHeader'

export const Route = createFileRoute('/site-notice')({
  component: SiteNoticePage,
  head: () => ({
    meta: [{ title: 'Site Notice' }],
    links: [
      {
        rel: 'canonical',
        href: 'https://www.daniel-pointecker.net/site-notice',
      },
    ],
  }),
})

function SiteNoticePage() {
  return (
    <div className="pt-0 pb-20">
      <PageHeader>Site Notice</PageHeader>
      <article className="text-xl max-w-2xl mx-auto relative z-50 mt-8">
        <h2 className="font-thin text-4xl mb-3">Daniel Pointecker</h2>
        <p className="mb-2">
          <b>Site description:</b> Portfolio & Blog for me - Daniel Pointecker
        </p>
        <p className="mb-2">
          <b>Address:</b> 4776 Diersbach, Großwaging 10 | Austria
        </p>
        <p>
          <b>E-Mail:</b> daniel.pointecker@gmail.com
        </p>
      </article>
    </div>
  )
}
