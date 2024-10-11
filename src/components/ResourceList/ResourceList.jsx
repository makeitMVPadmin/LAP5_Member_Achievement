import "./ResourceList.scss";
import ResourceCard from "../ResourceCard/ResourceCard.jsx";

// TODO: Remove this middle dep and just map over ResourceCard in ResourcePage
export default function ResourceList({
  resources,
  // selectResource,
  // activeResourceId,
}) {

  return (
    <section className="resourceList" aria-label="Resource List">
      <div className="resourceList__wrapper" role="list">
        {resources?.length > 0 ? (
          resources.map((resource) => {
              return (
                <ResourceCard
                  key={resource.id}
                  id={resource.id}
                  resource={resource.data}
                  // selectResource={selectResource}
                />
              );
          })
        ) : (
          <p>No resources available for this category.</p>
        )}
      </div>
    </section>
  );
}
