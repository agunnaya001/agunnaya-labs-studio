import { AnimatePresence, motion } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';

const SCENE_DURATIONS = {
  intro: 5000,
  agents: 6000,
  editor: 6000,
  deploy: 5000,
  gating: 5000,
  outro: 5000
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });

  return (
    <div className="w-full h-screen overflow-hidden relative bg-bg-base">
      
      {/* Persistent Background Layer */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none z-0" />
      
      {/* Persistent Midground Glows */}
      <motion.div
        className="absolute w-[40vw] h-[40vw] rounded-full blur-[100px] bg-primary/10 z-0"
        animate={{
          x: ['-20vw', '50vw', '20vw', '70vw', '30vw', '50vw'][currentScene],
          y: ['-10vh', '40vh', '70vh', '20vh', '50vh', '50vh'][currentScene],
          scale: [1, 1.2, 0.8, 1.5, 1, 1.4][currentScene],
          opacity: [0.3, 0.5, 0.2, 0.6, 0.4, 0.5][currentScene],
        }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        style={{ top: '50%', left: '50%', marginTop: '-20vw', marginLeft: '-20vw' }}
      />
      
      {/* Scene Transitions */}
      <AnimatePresence mode="popLayout">
        {currentScene === 0 && <Scene1 key="scene1" />}
        {currentScene === 1 && <Scene2 key="scene2" />}
        {currentScene === 2 && <Scene3 key="scene3" />}
        {currentScene === 3 && <Scene4 key="scene4" />}
        {currentScene === 4 && <Scene5 key="scene5" />}
        {currentScene === 5 && <Scene6 key="scene6" />}
      </AnimatePresence>
    </div>
  );
}
