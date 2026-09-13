import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, Gauge } from 'lucide-react';

export default function ControlBar({
  running,
  paused,
  delay,
  onPlay,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
  extraControls = null,
  disabled = false,
}) {
  return (
    <div className="control-bar" aria-label="Visualization controls">
      {/* Playback Controls */}
      <div className="control-group">
        {!running || paused ? (
          <button
            className="btn btn-primary"
            onClick={onPlay}
            disabled={disabled}
            title={running && paused ? 'Resume animation' : 'Start visualization'}
          >
            <Play size={16} fill="currentColor" />
            <span>{running && paused ? 'Resume' : 'Play'}</span>
          </button>
        ) : (
          <button
            className="btn btn-secondary"
            onClick={onPause}
            disabled={disabled}
            title="Pause execution"
          >
            <Pause size={16} />
            <span>Pause</span>
          </button>
        )}

        <button
          className="btn btn-secondary"
          onClick={onStep}
          disabled={disabled || (!running && !paused)}
          title="Advance single step"
        >
          <SkipForward size={16} />
          <span>Step</span>
        </button>

        <button
          className="btn btn-danger"
          onClick={onReset}
          title="Reset visualization"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      </div>

      {/* Speed Slider */}
      <div className="control-group">
        <div className="slider-group">
          <Gauge size={16} color="var(--text-secondary)" />
          <span>Speed:</span>
          {/* Note: Lower delay means faster */}
          <input
            aria-label="Animation speed"
            type="range"
            min="10"
            max="600"
            step="10"
            value={610 - delay}
            onChange={(e) => onSpeedChange(610 - Number(e.target.value))}
            title={`Delay: ${delay}ms`}
            style={{ width: '110px' }}
          />
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', minWidth: '45px' }}>
            {delay <= 50 ? 'Fast' : delay <= 200 ? 'Norm' : 'Slow'}
          </span>
        </div>
      </div>

      {/* Custom Algorithm Controls (e.g. Size, Graph options, etc.) */}
      {extraControls && (
        <div className="control-group">
          {extraControls}
        </div>
      )}
    </div>
  );
}
