import React, { useRef, useState } from 'react';
import './ChemicalDrawingTool.css';

const ChemicalDrawingTool = () => {
  const canvasRef = useRef(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [elements, setElements] = useState([]);
  const [bonds, setBonds] = useState([]);
  const [drawingBond, setDrawingBond] = useState(false);
  const [bondStart, setBondStart] = useState(null);

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (drawingBond && bondStart) {
      const bondEnd = { x, y };
      setBonds([...bonds, { start: bondStart, end: bondEnd }]);
      setBondStart(null);
      setDrawingBond(false);
    } else if (selectedElement) {
      setElements([...elements, { element: selectedElement, x, y }]);
    } else if (drawingBond) {
      setBondStart({ x, y });
    }
  };

  const handleDrawBond = () => {
    setDrawingBond(true);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bonds.forEach(bond => {
      ctx.beginPath();
      ctx.moveTo(bond.start.x, bond.start.y);
      ctx.lineTo(bond.end.x, bond.end.y);
      ctx.stroke();
    });

    elements.forEach(el => {
      ctx.beginPath();
      ctx.arc(el.x, el.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'black';
      ctx.fillText(el.element, el.x - 5, el.y + 5);
    });
  };

  React.useEffect(() => {
    draw();
  }, [elements, bonds]);

  return (
    <div>
      <div className="toolbar">
        <div className="element" onClick={() => setSelectedElement('C')}>C</div>
        <div className="element" onClick={() => setSelectedElement('H')}>H</div>
        <div className="element" onClick={() => setSelectedElement('O')}>O</div>
        <button onClick={handleDrawBond}>Draw Bond</button>
      </div>
      <canvas ref={canvasRef} width="800" height="600" onClick={handleCanvasClick}></canvas>
    </div>
  );
};

export default ChemicalDrawingTool;
