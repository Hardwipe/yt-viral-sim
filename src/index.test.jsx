import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock ReactDOM BEFORE importing index.jsx
const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({
  render: renderMock,
}));

vi.mock('react-dom/client', () => ({
  default: {
    createRoot: createRootMock,
  },
}));

// Mock App so we don’t render real UI
vi.mock('./App', () => ({
  default: () => <div data-testid="app">Mock App</div>,
}));

describe('index.jsx', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    vi.clearAllMocks();
  });

  it('creates root and renders App into #root', async () => {
    await import('./index.jsx');

    const rootElement = document.getElementById('root');

    expect(createRootMock).toHaveBeenCalledWith(rootElement);
    expect(renderMock).toHaveBeenCalledTimes(1);
  });
});