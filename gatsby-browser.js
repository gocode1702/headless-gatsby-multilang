import LanguageProvider from "./src/context/languageProvider";

export const wrapPageElement = ({ element }) => (
  <LanguageProvider>{element}</LanguageProvider>
);
