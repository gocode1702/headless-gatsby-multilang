import { graphql, useStaticQuery } from 'gatsby';

const useLanguages = () => {
  const data = useStaticQuery(
    graphql`
      query {
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

  const {
    allDatoCmsSite: {
      edges: [
        {
          node: { locale: defaultLanguage },
        },
      ],
    },

    datoCmsWebsiteSetting: { blogPath },
  } = data;

  return {
    defaultLanguage,
    blogPath,
  };
};

export default useLanguages;
