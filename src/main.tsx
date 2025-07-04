import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { validateSupabaseConnection } from './integrations/supabase/validate';

// Validate Supabase connection on startup (in development mode)
if (import.meta.env.DEV) {
  validateSupabaseConnection()
    .then(result => {
      if (result.isValid) {
        console.log('✅ ' + result.message);
      } else {
        console.error('❌ ' + result.message);
      }
    })
    .catch(err => {
      console.error('❌ Error validating Supabase connection:', err);
    });
}

createRoot(document.getElementById("root")!).render(<App />);
