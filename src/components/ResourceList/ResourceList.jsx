import ResourceCard from "../ResourceCard/ResourceCard";
import "./ResourceList.scss";
import { useMemo } from "react";

export default function ResourceList({
  resources,
  selectResource,
  activeResourceId,
  commentCounts,
}) {
  // Removed the previous useEffect and created a new array with updated comment counts
  const updatedResources = useMemo(() => {
    return resources.map(resource => ({
      ...resource,
      commentCount: commentCounts[resource.id] || 0
    }));
  }, [resources, commentCounts]);

  return (
    <section className="resourceList" aria-label="Resource List">
      <div className="resourceList__wrapper" role="list">
        {updatedResources.length > 0 ? (
          updatedResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              selectResource={selectResource}
              isActive={resource.id === activeResourceId}
              commentCount={resource.commentCount}
            />
          ))
        ) : (
          <p>No resources available for this category.</p>
        )}
      </div>
    </section>
  );
}