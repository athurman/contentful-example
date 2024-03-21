import { getTerritoryContent, getTerritoryStaticParams } from "@/lib/contentful-api/territory-collection";
import TouristActivity from "./activity";

export async function generateStaticParams() {
  const territoryQueryResult = await getTerritoryStaticParams();
  const staticParams: { territory: string }[] = territoryQueryResult.data?.territoryCollection?.items?.filter((territoryEntry) => (
    !!territoryEntry?.territoryName
  ))?.map((territory) => ({
    territory: territory?.territoryName ?? '',
  })) ?? [];

  return staticParams;
}

export default async function TerritoryPage({ params }: { params: { territory: string } }) {
  const content = await getTerritoryContent({
    territoryName: params.territory,
    preview: process.env.NODE_ENV !== "production"
  });
  if (content == null || content === undefined || content.activitiesCollection == null || content.activitiesCollection === undefined || !content.activitiesCollection.items) {
    return null;
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <section
        className="bg-cover bg-center py-80 w-full"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(71, 81, 105, 0.65),
              rgba(71, 81, 105, 0.25)
            ),
            url(${content?.heroImageUrl})
          `,
        }}
      >
        <div className="flex flex-col items-center mx-auto text-center text-white">
          <h1 className="text-8xl font-medium mb-6">{content?.heroHeader}</h1>
        </div>
      </section>
      <section className="py-24">
        <div className="flex flex-col mx-auto text-center text-slate-600">
          <h1 className="text-5xl font-medium mb-6">Things To Do</h1>
          <div className="py-8 mb-16 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3">
            {content?.activitiesCollection?.items?.map((activity, i) => {
              if (activity == null) {
                return null;
              }

              return (
                <TouristActivity key={i} activity={activity} />
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
