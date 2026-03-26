import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import App from './App';

vi.mock('./App.css', () => ({}));

vi.mock('@vercel/analytics/react', () => ({
  Analytics: () => <div data-testid="vercel-analytics" />,
}));

vi.mock('./components/ViralDashboard', () => ({
  default: ({ title, videoSrc, onStop }) => (
    <div data-testid="viral-dashboard">
      <div>Dashboard Title: {title}</div>
      <div>Dashboard Src: {videoSrc}</div>
      <button onClick={onStop}>Mock Stop</button>
    </div>
  ),
}));

describe('App', () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();

    URL.createObjectURL = vi.fn(() => 'blob:mock-video-url');
    URL.revokeObjectURL = vi.fn();

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            message: 'Upload received. Background YouTube job started.',
            detected_upload_type: 'shorts',
          }),
      })
    );
  });

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    global.fetch = originalFetch;
  });

  it('renders initial upload UI', () => {
    render(<App />);

    expect(screen.getByText('FakeTube')).toBeInTheDocument();
    expect(
      screen.getByText(/world’s totally not most realistic virality simulator/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter fake video title/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /upload video/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /start simulation/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument();
  });

  it('has start simulation disabled initially', () => {
    render(<App />);

    expect(
      screen.getByRole('button', { name: /start simulation/i })
    ).toBeDisabled();
  });

  it('updates the video title input', () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/enter fake video title/i);
    fireEvent.change(input, { target: { value: 'My Fake Viral Video' } });

    expect(input).toHaveValue('My Fake Viral Video');
  });

  it('clicking upload button triggers hidden file input click', () => {
    render(<App />);

    const uploadButton = screen.getByRole('button', { name: /upload video/i });
    const fileInput = document.querySelector('input[type="file"]');
    const clickSpy = vi.spyOn(fileInput, 'click');

    fireEvent.click(uploadButton);

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('stores uploaded video file via object URL', () => {
    render(<App />);

    const file = new File(['video'], 'demo.mp4', { type: 'video/mp4' });
    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(screen.getByText(/selected:/i)).toBeInTheDocument();
    expect(screen.getByText('demo.mp4')).toBeInTheDocument();
  });

  it('enables start simulation only after title and file are provided', () => {
    render(<App />);

    const startButton = screen.getByRole('button', { name: /start simulation/i });
    const titleInput = screen.getByPlaceholderText(/enter fake video title/i);
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['video'], 'demo.mp4', { type: 'video/mp4' });

    expect(startButton).toBeDisabled();

    fireEvent.change(titleInput, { target: { value: 'Test Video' } });
    expect(startButton).toBeDisabled();

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    expect(startButton).toBeEnabled();
  });

  it('does not set a video when no file is selected', () => {
    render(<App />);

    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, {
      target: { files: [] },
    });

    expect(URL.createObjectURL).not.toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: /start simulation/i })
    ).toBeDisabled();
  });

  it('starts simulation and renders ViralDashboard with correct props', async () => {
    render(<App />);

    const titleInput = screen.getByPlaceholderText(/enter fake video title/i);
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['video'], 'demo.mp4', { type: 'video/mp4' });

    fireEvent.change(titleInput, { target: { value: 'Test Video' } });
    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByRole('button', { name: /start simulation/i }));

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/upload',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      })
    );

    expect(await screen.findByTestId('viral-dashboard')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Title: Test Video')).toBeInTheDocument();
    expect(
      screen.getByText('Dashboard Src: blob:mock-video-url')
    ).toBeInTheDocument();
  });

  it('resets simulation when ViralDashboard calls onStop', async () => {
    render(<App />);

    const titleInput = screen.getByPlaceholderText(/enter fake video title/i);
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['video'], 'demo.mp4', { type: 'video/mp4' });

    fireEvent.change(titleInput, { target: { value: 'Test Video' } });
    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByRole('button', { name: /start simulation/i }));

    expect(await screen.findByTestId('viral-dashboard')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /mock stop/i }));

    await waitFor(() => {
      expect(screen.queryByTestId('viral-dashboard')).not.toBeInTheDocument();
    });

    expect(
      screen.getByPlaceholderText(/enter fake video title/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /start simulation/i })
    ).toBeDisabled();
    expect(screen.getByPlaceholderText(/enter fake video title/i)).toHaveValue('');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-video-url');
  });

  it('shows an upload error when backend upload fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Upload failed' }),
      })
    );

    render(<App />);

    const titleInput = screen.getByPlaceholderText(/enter fake video title/i);
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['video'], 'demo.mp4', { type: 'video/mp4' });

    fireEvent.change(titleInput, { target: { value: 'Test Video' } });
    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByRole('button', { name: /start simulation/i }));

    expect(await screen.findByText(/upload failed/i)).toBeInTheDocument();
    expect(screen.queryByTestId('viral-dashboard')).not.toBeInTheDocument();
  });

  it('renders the buy me a coffee link correctly', () => {
    render(<App />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      'https://www.buymeacoffee.com/FakeTube'
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});