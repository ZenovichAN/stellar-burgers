import { BrowserRouter } from 'react-router-dom';

import { appTheme } from './theme';

import type { Decorator, Preview } from '@storybook/react';

import '@krgaa/react-developer-burger-ui-components';

import '../src/index.css';

const withRouter: Decorator = (Story) => (
  <BrowserRouter>
    <div style={{ padding: 20 }}>
      <Story />
    </div>
  </BrowserRouter>
);

const preview: Preview = {
  parameters: {
    docs: {
      theme: appTheme,
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo',
    },
  },

  decorators: [withRouter],
};

export default preview;
