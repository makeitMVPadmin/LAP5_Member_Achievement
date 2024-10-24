
// function definition 

// const programmingTerms = [
//     { tags: ["JavaScript", "Node.js", "React", "Frontend"] },
//     { tags: ["Python", "JavaScript", "DevOps", "Backend"] },
//     { tags: ["BackendL", "CSS", "Node.js", "Responsive Design"] },
//     { tags: ["SQL", "PostgreSQL", "Database", "Queries"] },
//     { tags: ["Backend", "DevOps", "Node.js", "Collaboration"] },
//     { tags: ["Docker", "Backends", "DevOps", "CI/CD"] },
//     { tags: ["Kubernetes", "Orchestration", "Cloud", "Microservices"] },
//     { tags: ["REST API", "Endpoints", "JSON", "HTTP Methods"] },
//     { tags: ["Agile", "Scrum", "Project Management", "Sprint"] },
//     { tags: ["Chakra UI", "CSS-in-JS", "Components", "Styling"] }
//   ];

export const tallyPopularTopics = (resources) => {
    const tagsTally = {};
      resources.forEach (resource => { 
        resource.tags.forEach (tag =>{
            if (tagsTally[tag]) {
                tagsTally[tag]++;
              }
              else {
                tagsTally[tag] = 1;
              }
        })
      })
      let tags = Object.keys(tagsTally)
      
      tags.sort ((a,b) => {
        return tagsTally[b] - tagsTally[a]
      })
    return tags.slice(0,5);
  };


/* 
Outer loop 1:
  resource =  { tags: ["JavaScript", "Node.js", "React", "Frontend"] },
  resource.tags = ["JavaScript", "Node.js", "React", "Frontend"]
  inner loop 1: 
    tag = "JavaScript"
    check if the tagsTally object contain the property javascript = initial is false, empty object
    goes to the else 
        tagsTally {javascript: 1}
  inner loop 2: 
    tag = "Node.js"
    if node.js is false
    tagTally {javascript: 1, node.js: 1}
    continue on inner loop 3, 4 ... 
    after inner loop 4, 
        tagTally {JavaScript: 1, Node.js: 1, React: 1, Frontend:1}

Outer loop 2: 
resource is the second object in the array 
resource = {tags: ["Python", "Django", "Flask", "Backend"]}

*/

  