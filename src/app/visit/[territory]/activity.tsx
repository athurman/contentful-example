import { graphql, useFragment, FragmentType, DocumentType } from '@/gql';

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
    <div className="py-32 mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
      <h2 className={`mb-3 text-2xl font-semibold`}>{activity.title}</h2>
    </div>
  )
}
