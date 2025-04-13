import React, { useState } from 'react';
import { SwipeItem } from './SwipeItem';

export function SwipeList() {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const items = [
    { id: '1', text: '🍕 피자' },
    { id: '2', text: '🍔 햄버거' },
    { id: '3', text: '🍜 라면' },
  ];

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif' }}>
      {items.map((item) => (
        <SwipeItem
          key={item.id}
          id={item.id}
          text={item.text}
          openItemId={openItemId}
          onOpen={setOpenItemId}
          onDelete={() => {
            console.log(`${item.text} 삭제됨`);
            setOpenItemId(null);
          }}
        />
      ))}
    </div>
  );
}
