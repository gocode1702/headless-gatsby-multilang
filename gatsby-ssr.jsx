import { ThemeProvider } from './src/components/ContextProviders/ThemeProvider';
import { GlobalStyle } from './src/components/Layout/sharedStyles/globalStyles';

export const onRenderBody = ({ setBodyAttributes }) => {
  setBodyAttributes({
    style: {
      display: 'none',
    },
  });
};

export const wrapPageElement = ({ element }) => (
  <>
    <GlobalStyle />
    <ThemeProvider>{element}</ThemeProvider>
  </>
);
