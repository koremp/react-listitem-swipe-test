import { useState } from 'react';

import './App.css';
import { SwipeList } from './SwipeList';

function App() {
  const [list, setList] = useState<string[]>([
    '🍕 피자',
    '🍔 햄버거',
    '🍜 라면',
  ]);

  return (
    <div className="layout">
      <SwipeList />
    </div>
  );
}

export default App;
