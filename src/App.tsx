import React, { useEffect, useState } from 'react';
import './App.css';
import { Document } from './types';
import Card from './Card';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

const dataUrl = '/data.json';

const App: React.FC = () => {
  const [cards, setCards] = useState<Document[]>([]);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);

  useEffect(() => {
    fetch(dataUrl)
      .then((response) => response.json())
      .then((data: Document[]) => setCards(data))
      .catch((error) => console.error('Error loading JSON data:', error));
  }, []);

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCards(items);
  };

  const handleCardClick = (imageType: string) => {
    setOverlayImage(imageType);
  };

  const closeOverlay = () => setOverlayImage(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeOverlay();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="cards">
        {(provided) => (
          <div
            className="card-container"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {cards.map((card, index) => (
              <Draggable key={card.type} draggableId={card.type} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card card={card} onImageClick={handleCardClick} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {overlayImage && (
        <div className="overlay" onClick={closeOverlay}>
          <img
            src={`/${overlayImage}.png`}
            alt="Overlay"
          />
        </div>
      )}
    </DragDropContext>
  );
};

export default App;
