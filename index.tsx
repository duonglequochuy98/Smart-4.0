import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Hide loading screen
const loadingScreen = document.getElementById('loading-screen');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Could not find root element to mount to");
  if (loadingScreen) {
    loadingScreen.innerHTML = '<div style="text-align: center; padding: 2rem;"><h2 style="color: #e12d2d;">Lỗi: Không tìm thấy root element</h2></div>';
  }
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Hide loading screen after render
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
      }
    }, 500);
  } catch (error) {
    console.error("Error mounting app:", error);
    if (loadingScreen) {
      loadingScreen.innerHTML = '<div style="text-align: center; padding: 2rem;"><h2 style="color: #e12d2d;">Lỗi khởi tạo ứng dụng</h2><p style="color: #64748b;">' + error + '</p></div>';
    }
  }
}
