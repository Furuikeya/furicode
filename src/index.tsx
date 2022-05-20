import { createRoot } from 'react-dom/client';

// import CodeCell from './components/code-cell.component';
import TextEditor from './components/text-editor';

import 'bulmaswatch/slate/bulmaswatch.min.css';

const App = () => {
  return (
    <div>
      <TextEditor />
      {/* <CodeCell /> */}
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
