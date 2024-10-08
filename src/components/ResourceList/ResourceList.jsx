import "./ResourceList.scss";
import ResourceCard from "../ResourceCard/ResourceCard.jsx";

export default function ResourceList({
  resources,
  selectResource,
  activeResourceId,
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
                  selectResource={selectResource}
                  isActive={resource.id === activeResourceId}
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
