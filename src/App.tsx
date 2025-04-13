import { useState } from 'react';

function App() {
  const [list, setList] = useState<string[]>(['111111', '22222']);

  return (
    <div className="layout">
      App
      <ul className="list">
        {list.map((item) => (
          <li className="list-item" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
