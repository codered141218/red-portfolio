"use client";

import { useEffect, useRef, useState } from "react";

const CELL_SIZE = 40;
const TRAIL_DURATION = 100;

type Trail = {
  id: number;
  key: number;
};

export default function GridBackground() {
  const gridRef = useRef<HTMLDivElement>(null);
  const hoveredCellRef = useRef<number | null>(null);
  const trailKeyRef = useRef(0);
  const trailTimersRef = useRef<Set<number>>(new Set());
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [trails, setTrails] = useState<Trail[]>([]);

  useEffect(() => {
    const element = gridRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setGrid({
        cols: Math.ceil(width / CELL_SIZE),
        rows: Math.ceil(height / CELL_SIZE),
      });
      hoveredCellRef.current = null;
      setHoveredCell(null);
      setTrails([]);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const addTrail = (id: number) => {
      const key = ++trailKeyRef.current;

      setTrails((currentTrails) => [
        ...currentTrails.filter((trail) => trail.id !== id),
        { id, key },
      ]);

      const timer = window.setTimeout(() => {
        setTrails((currentTrails) =>
          currentTrails.filter((trail) => trail.key !== key),
        );
        trailTimersRef.current.delete(timer);
      }, TRAIL_DURATION);

      trailTimersRef.current.add(timer);
    };

    const setActiveCell = (nextCell: number | null) => {
      const previousCell = hoveredCellRef.current;
      if (previousCell === nextCell) return;

      if (previousCell !== null) addTrail(previousCell);

      hoveredCellRef.current = nextCell;
      setHoveredCell(nextCell);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const element = gridRef.current;

      if (!element || event.pointerType !== "mouse" || grid.cols === 0) {
        setActiveCell(null);
        return;
      }

      const bounds = element.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      if (x < 0 || y < 0 || x >= bounds.width || y >= bounds.height) {
        setActiveCell(null);
        return;
      }

      const column = Math.floor(x / CELL_SIZE);
      const row = Math.floor(y / CELL_SIZE);
      const nextCell = row * grid.cols + column;

      setActiveCell(nextCell);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [grid.cols]);

  useEffect(() => {
    const timers = trailTimersRef.current;
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const trailsByCell = new Map(trails.map((trail) => [trail.id, trail]));

  return (
    <div
      ref={gridRef}
      className="hero-grid"
      aria-hidden="true"
      style={{
        gridTemplateColumns: `repeat(${grid.cols}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${grid.rows}, ${CELL_SIZE}px)`,
      }}
    >
      {Array.from({ length: grid.cols * grid.rows }, (_, index) => {
        const trail = trailsByCell.get(index);

        return (
          <span
            className={`hero-grid-cell${hoveredCell === index ? " is-hovered" : ""}`}
            key={index}
          >
            {trail ? (
              <span className="hero-grid-trail" key={trail.key} />
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
