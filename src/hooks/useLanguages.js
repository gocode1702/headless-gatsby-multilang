import { graphql, useStaticQuery } from "gatsby";

const useLanguages = () => {
  const data = useStaticQuery(
    graphql`
      query DefaultLanguageQuery {
        allDatoCmsSite {
          edges {
            node {
              locale
            }
          }
        }
        datoCmsWebsiteSetting {
          blogPath
        }
      }
    `
  );
  return {
    defaultLanguage: data.allDatoCmsSite.edges[0].node.locale,
    availableLanguages: data.allDatoCmsSite.edges.length,
    defaultBlogPath: data.datoCmsWebsiteSetting.blogPath,
  };
};

export default useLanguages;
