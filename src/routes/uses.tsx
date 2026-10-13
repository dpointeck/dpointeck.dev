import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { PageHeader } from '../components/PageHeader'

const getUsesData = createServerFn({ method: 'GET' }).handler(async () => {
  const fs = await import('fs/promises')
  const path = await import('path')
  const yaml = await import('yaml')

  const usesFilePath = path.join(process.cwd(), 'src/data/uses.yml')
  const usesFile = await fs.readFile(usesFilePath, 'utf8')
  const usesData = yaml.parse(usesFile)

  return usesData as {
    equiptment: string[]
    software: string[]
    edc: string[]
  }
})

export const Route = createFileRoute('/uses')({
  component: UsesPage,
  loader: () => getUsesData(),
  head: () => ({
    meta: [{ title: 'Uses' }],
    links: [
      { rel: 'canonical', href: 'https://www.daniel-pointecker.net/uses' },
    ],
  }),
})

function UsesPage() {
  const usesData = Route.useLoaderData()

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader>Uses</PageHeader>
      <div className="mt-8 space-y-12">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-primary tracking-tight">
            Tech
          </h2>
          <ul className="space-y-2.5 text-secondary">
            {usesData.equiptment.map((item: string) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-4 text-primary tracking-tight">
            Software
          </h2>
          <ul className="space-y-2.5 text-secondary">
            {usesData.software.map((item: string) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-4 text-primary tracking-tight">
            EDC
          </h2>
          <ul className="space-y-2.5 text-secondary">
            {usesData.edc.map((item: string) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
