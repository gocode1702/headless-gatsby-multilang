import { useStaticQuery, graphql } from 'gatsby';

const useSiteUrl = () => {
  const data = useStaticQuery(
    graphql`
      query {
        datoCmsWebsiteSetting {
          siteUrl
        }
      }
    `
  );

  const { datoCmsWebsiteSetting } = data;

  return datoCmsWebsiteSetting;
};

export default useSiteUrl;
