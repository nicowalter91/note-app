import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
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
  }, []);  const togglePlay = () => {
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
      </div>

      {/* Annotation Form Modal */}
      {showAnnotationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Annotation hinzufügen ({formatTime(currentTime)})
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleAnnotationSubmit({
                title: formData.get('title'),
                description: formData.get('description'),
                category: formData.get('category')
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Titel
                  </label>
                  <input
                    name="title"
                    type="text"
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="z.B. Gute Kombination"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kategorie
                  </label>
                  <select
                    name="category"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="general">Allgemein</option>
                    <option value="tactics">Taktik</option>
                    <option value="technique">Technik</option>
                    <option value="mistake">Fehler</option>
                    <option value="highlight">Highlight</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Beschreibung
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Detaillierte Beschreibung der Szene..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAnnotationForm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Hinzufügen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}    </div>
  );
});

export default VideoPlayer;
