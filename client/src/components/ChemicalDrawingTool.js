import React, { useRef, useState, useEffect } from 'react';
import './ChemicalDrawingTool.css';

const ChemicalDrawingTool = () => {
  const canvasRef = useRef(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [elements, setElements] = useState([]);
  const [bonds, setBonds] = useState([]);
  const [drawingBond, setDrawingBond] = useState(false);
  const [bondType, setBondType] = useState('single');
  const [bondStart, setBondStart] = useState(null);
  const [bondEnd, setBondEnd] = useState(null);
  const atomRadius = 20;

  const isCloseToAtom = (x, y) => {
    for (let el of elements) {
      const distance = Math.sqrt((el.x - x) ** 2 + (el.y - y) ** 2);
      if (distance <= atomRadius) {
        return el;
      }
    }
    return null;
  };

  const handleCanvasMouseDown = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const startAtom = isCloseToAtom(x, y);
    if (drawingBond && startAtom) {
      setBondStart(startAtom);
      setBondEnd({ x, y });
      console.log('Bond start set at:', startAtom);
    } else if (selectedElement && !isCloseToAtom(x, y)) {
      const canPlace = elements.every(el => {
        const distance = Math.sqrt((el.x - x) ** 2 + (el.y - y) ** 2);
        return distance > 2 * atomRadius;
      });
      if (canPlace) {
        setElements([...elements, { element: selectedElement, x, y }]);
        console.log('Element added:', { element: selectedElement, x, y });
      } else {
        console.log('Cannot place element, too close to another element');
      }
    } else if (drawingBond) {
      // If in bond drawing mode but not clicking on an atom, deactivate bond drawing mode
      setDrawingBond(false);
      setBondStart(null);
      setBondEnd(null);
      console.log('Bond drawing mode deactivated');
    }
  };

  const handleCanvasMouseMove = (event) => {
    if (drawingBond && bondStart) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setBondEnd({ x, y });
    }
  };

  const handleCanvasMouseUp = (event) => {
    if (drawingBond && bondStart) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const endAtom = isCloseToAtom(x, y);
      if (endAtom) {
        setBonds([...bonds, { start: bondStart, end: endAtom, type: bondType }]);
        console.log('Bond drawing completed:', { start: bondStart, end: endAtom, type: bondType });
      } else {
        console.log('Bond end not on an atom, bond not created');
      }
      setBondStart(null);
      setBondEnd(null);
    }
  };

  const handleDrawBond = (type) => {
    setDrawingBond(true);
    setBondType(type);
    setSelectedElement(null);  // Ensure no element is selected while drawing a bond
    console.log('Bond drawing mode activated for', type, 'bond');
  };

  const draw = () => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bonds.forEach(bond => {
    const { start, end, type } = bond;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / length;
    const uy = dy / length;
    const offset = 5;  // Distance between parallel lines

    if (type === 'single') {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }

    if (type === 'double') {
      ctx.beginPath();
      ctx.moveTo(start.x - offset * uy, start.y + offset * ux);
      ctx.lineTo(end.x - offset * uy, end.y + offset * ux);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(start.x + offset * uy, start.y - offset * ux);
      ctx.lineTo(end.x + offset * uy, end.y - offset * ux);
      ctx.stroke();
    }

    if (type === 'triple') {
      const tripleOffset = 5;  // Distance between outer lines for triple bond
      ctx.beginPath();
      ctx.moveTo(start.x - tripleOffset * uy, start.y + tripleOffset * ux);
      ctx.lineTo(end.x - tripleOffset * uy, end.y + tripleOffset * ux);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(start.x + tripleOffset * uy, start.y - tripleOffset * ux);
      ctx.lineTo(end.x + tripleOffset * uy, end.y - tripleOffset * ux);
      ctx.stroke();
    }
  });

  elements.forEach(el => {
    ctx.beginPath();
    ctx.arc(el.x, el.y, atomRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fillText(el.element, el.x - 5, el.y + 5);
  });

  if (drawingBond && bondStart && bondEnd) {
    const dx = bondEnd.x - bondStart.x;
    const dy = bondEnd.y - bondStart.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / length;
    const uy = dy / length;
    const offset = 5;  // Distance between parallel lines

    ctx.beginPath();
    ctx.moveTo(bondStart.x, bondStart.y);
    ctx.lineTo(bondEnd.x, bondEnd.y);
    ctx.stroke();

    if (bondType === 'double') {
      ctx.beginPath();
      ctx.moveTo(bondStart.x - offset * uy, bondStart.y + offset * ux);
      ctx.lineTo(bondEnd.x - offset * uy, bondEnd.y + offset * ux);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(bondStart.x + offset * uy, bondStart.y - offset * ux);
      ctx.lineTo(bondEnd.x + offset * uy, bondEnd.y - offset * ux);
      ctx.stroke();
    }

    if (bondType === 'triple') {
      const tripleOffset = 5;  // Distance between outer lines for triple bond
      ctx.beginPath();
      ctx.moveTo(bondStart.x - tripleOffset * uy, bondStart.y + tripleOffset * ux);
      ctx.lineTo(bondEnd.x - tripleOffset * uy, bondEnd.y + tripleOffset * ux);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(bondStart.x, bondStart.y);
      ctx.lineTo(bondEnd.x, bondEnd.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(bondStart.x + tripleOffset * uy, bondStart.y - tripleOffset * ux);
      ctx.lineTo(bondEnd.x + tripleOffset * uy, bondEnd.y - tripleOffset * ux);
      ctx.stroke();
    }
  }
};


  useEffect(() => {
    draw();
    console.log('Canvas updated with new elements or bonds');
  }, [elements, bonds, bondEnd]);

  return (
    <div>
      <div className="toolbar">
        <div className="element" onClick={() => setSelectedElement('C')}>C</div>
        <div className="element" onClick={() => setSelectedElement('H')}>H</div>
        <div className="element" onClick={() => setSelectedElement('O')}>O</div>
        <button onClick={() => handleDrawBond('single')}>Draw Single Bond</button>
        <button onClick={() => handleDrawBond('double')}>Draw Double Bond</button>
        <button onClick={() => handleDrawBond('triple')}>Draw Triple Bond</button>
      </div>
      <canvas 
        ref={canvasRef} 
        width="800" 
        height="600" 
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
      ></canvas>
    </div>
  );
};

export default ChemicalDrawingTool;
