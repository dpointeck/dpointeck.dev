import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '../components/PageHeader'

export const Route = createFileRoute('/privacy-policy')({
  component: PrivacyPolicyPage,
  head: () => ({
    meta: [
      { title: 'Privacy Policy' },
      {
        name: 'description',
        content:
          'This Privacy Policy provides information about which data we collect, what we use it for and which rights you have.',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://www.daniel-pointecker.net/privacy-policy',
      },
    ],
  }),
})

function PrivacyPolicyPage() {
  return (
    <div className="pt-0 pb-20">
      <PageHeader>Privacy Policy</PageHeader>
      <article className="prose max-w-2xl mx-auto relative z-50 mt-8 dark:prose-invert">
        <p>
          As this is just a simple site / blog, I do not process any data from
          viewers at all. I do not use webtrackers like google analytics and
          also do not use cookies to store information about your websession.
        </p>
        <h2>Responsible for this site</h2>
        <p>Daniel Pointecker</p>
        <h3>Address</h3>
        <p>
          Daniel Pointecker
          <br />
          Großwaging 10
          <br />
          4776 Diersbach
          <br />
          AUSTRIA
        </p>
        <p>
          email:{' '}
          <a href="mailto:daniel.pointecker@hey.com">
            daniel.pointecker@hey.com
          </a>
        </p>
      </article>
    </div>
  )
}
