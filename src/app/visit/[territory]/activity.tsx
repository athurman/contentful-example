import { graphql, useFragment, FragmentType, DocumentType } from '@/gql';
import Image from "next/image";

export const ActivityFragment = graphql(/* GraphQL */ `
  fragment TouristActivity on TouristActivity {
    sys {
      id
    }
    title
    image {
      url
      title
      width
      height
    }
    description {
      json
      links {
        assets {
          block {
            sys {
              id
            }
            url
            description
          }
        }
      }
    }
  }
`);

type Activity = DocumentType<typeof ActivityFragment>

export default function TouristActivity(props: {
  activity: FragmentType<typeof ActivityFragment>;
}) {
  const activity: Activity = useFragment(
    ActivityFragment,
    props.activity,
  );
  return (
    <div className="py-32 mb-32 flex flex-col text-center justify-center items-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
      {activity.image?.url && (<Image src={activity.image.url} alt={activity.title ?? ''} width={200} height={200} className="max-w-full h-auto" />)}
      <h2 className={`my-3 text-2xl text-center font-semibold`}>{activity.title}</h2>
    </div>
  )
}
