import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';

export const SCENE_DURATIONS: Record<string, number> = {
  intro: 5000,
  agents: 6000,
  editor: 6000,
  deploy: 5000,
  gating: 5000,
  outro: 5000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  intro: Scene1,
  agents: Scene2,
  editor: Scene3,
  deploy: Scene4,
  gating: Scene5,
  outro: Scene6,
};

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div className="w-full h-screen overflow-hidden relative bg-bg-base">
      {/* Persistent Background Layer */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none z-0" />

      {/* Persistent Midground Glows */}
      <motion.div
        className="absolute w-[40vw] h-[40vw] rounded-full blur-[100px] bg-primary/10 z-0"
        animate={{
          x: ['-20vw', '50vw', '20vw', '70vw', '30vw', '50vw'][sceneIndex],
          y: ['-10vh', '40vh', '70vh', '20vh', '50vh', '50vh'][sceneIndex],
          scale: [1, 1.2, 0.8, 1.5, 1, 1.4][sceneIndex],
          opacity: [0.3, 0.5, 0.2, 0.6, 0.4, 0.5][sceneIndex],
        }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        style={{ top: '50%', left: '50%', marginTop: '-20vw', marginLeft: '-20vw' }}
      />

      {/* Scene Transitions */}
      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </div>
  );
}
