import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { getAllPlayers } from '../../utils/playerService';
import { 
  Card,
  Button,
  Input,
  Textarea,
  Select,
  FormGroup,
  Modal
} from '../UI/DesignSystem';
import { 
  FaPlay, 
  FaPause, 
  FaVolumeMute, 
  FaVolumeUp, 
  FaExpand,
  FaCompress,
  FaStepBackward,
  FaStepForward,
  FaBookmark,
  FaPlus
} from 'react-icons/fa';

const VideoPlayer = forwardRef(({ video, annotations = [], onAddAnnotation, className = '' }, ref) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const playersData = await getAllPlayers();
        setPlayers(playersData || []);
      } catch (error) {
        console.error('Error loading players:', error);
        setPlayers([]);
      }
    };

    loadPlayers();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(error => {
        console.error('Video play error:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const container = videoRef.current.parentElement;
    if (!isFullscreen) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const skipTime = (seconds) => {
    const video = videoRef.current;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const changePlaybackRate = (rate) => {
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const addAnnotation = () => {
    setShowAnnotationForm(true);
  };

  const handleAnnotationSubmit = (annotationData) => {
    onAddAnnotation({
      ...annotationData,
      timestamp: currentTime,
      videoId: video.id
    });
    setShowAnnotationForm(false);
  };

  const seekToTime = (time) => {
    const video = videoRef.current;
    if (video && duration > 0) {
      video.currentTime = Math.max(0, Math.min(duration, time));
    }
  };

  // Expose seekToTime function to parent component
  useImperativeHandle(ref, () => ({
    seekToTime
  }));

  return (
    <div className={`bg-black rounded-lg overflow-hidden ${className}`}>
      {/* Video Element */}
      <div className="relative">        <video
          ref={videoRef}
          src={video.url}
          className="w-full"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        {/* Annotation Markers on Timeline */}
        <div className="absolute bottom-16 left-0 right-0 h-1">
          {annotations.map((annotation, index) => (
            <div
              key={index}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full transform -translate-y-1/2"
              style={{ left: `${(annotation.timestamp / duration) * 100}%` }}
              title={annotation.title}
            />
          ))}
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Timeline */}
          <div className="mb-4">
            <div
              className="w-full h-2 bg-gray-600 rounded cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-blue-500 rounded"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between text-white">
            {/* Left Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => skipTime(-10)}
                className="hover:text-blue-400 transition-colors"
                title="10s zurück"
              >
                <FaStepBackward />
              </button>
              
              <button
                onClick={togglePlay}
                className="bg-blue-600 hover:bg-blue-700 rounded-full p-3 transition-colors"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              
              <button
                onClick={() => skipTime(10)}
                className="hover:text-blue-400 transition-colors"
                title="10s vor"
              >
                <FaStepForward />
              </button>

              <div className="flex items-center space-x-2">
                <button onClick={toggleMute}>
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20"
                />
              </div>

              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Center Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={addAnnotation}
                className="bg-yellow-600 hover:bg-yellow-700 rounded px-3 py-1 text-sm transition-colors flex items-center"
                title="Annotation hinzufügen"
              >
                <FaPlus className="mr-1" size={12} />
                Notiz
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-3">
              {/* Playback Speed */}
              <select
                value={playbackRate}
                onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
                className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
              >
                <option value={0.25}>0.25x</option>
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>

              <button
                onClick={toggleFullscreen}
                className="hover:text-blue-400 transition-colors"
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>
        </div>
      </div>      {/* Annotation Form Modal */}
      <Modal
        isOpen={showAnnotationForm}
        onClose={() => setShowAnnotationForm(false)}
        title={`Annotation hinzufügen (${formatTime(currentTime)})`}
        size="default"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          handleAnnotationSubmit({
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            playerId: formData.get('playerId') || null
          });
        }}>
          <FormGroup>
            <Input
              name="title"
              label="Titel"
              required
              placeholder="z.B. Gute Kombination"
            />

            <Select
              name="category"
              label="Kategorie"
              options={[
                { value: 'general', label: 'Allgemein' },
                { value: 'tactics', label: 'Taktik' },
                { value: 'technique', label: 'Technik' },
                { value: 'mistake', label: 'Fehler' },
                { value: 'highlight', label: 'Highlight' }
              ]}
            />

            <Select
              name="playerId"
              label="Spieler (optional)"
              placeholder="Kein Spieler ausgewählt"
              options={players.map(player => ({
                value: player._id,
                label: `${player.jersey ? `#${player.jersey} ` : ''}${player.name}${player.position ? ` (${player.position})` : ''}`
              }))}
            />

            <Textarea
              name="description"
              label="Beschreibung"
              rows={3}
              placeholder="Detaillierte Beschreibung der Szene..."
            />
          </FormGroup>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAnnotationForm(false)}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Hinzufügen
            </Button>
          </div>
        </form>
      </Modal></div>
  );
});

export default VideoPlayer;
