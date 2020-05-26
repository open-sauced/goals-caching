const {Toolkit} = require("actions-toolkit");

// Run your GitHub Action!
Toolkit.run(async tools => {
  const issueTitles = await fetchIssueData(tools);

  tools.exit.success("We did it!");
});

async function fetchIssueData(tools) {
  const repoOwner = tools.context.payload.repository.owner.login;
  const repoName = tools.context.payload.repository.name;

  const query = `query ($owner: String!) { 
   {
        repository(owner: "${repoOwner}", name:"${repoName}") {
          name
          owner {
            login
          }
          issues(states: OPEN, first: 100) {
            totalCount
            edges {
              node {
                title
                labels(first: 3) {
                  edges {
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }

  }`;

  const result = await tools.github.graphql(query);
  return result;
}
