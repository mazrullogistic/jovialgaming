import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import glbFile from "../modal/modalurl.glb";

export default function Model({
  playAnimation,
  props,
  setIsOpenedFinished,
  setIsClosedFinished,
  setIsShowOutFinished,
  cameraState,
  isOpened,
  selectedglbmodal,
}) {
  const vec = new THREE.Vector3();

  const { animations, scene } = useGLTF(selectedglbmodal);

  const { actions, names } = useAnimations(animations, scene);
  const [shouldLerp, setShouldLerp] = useState(false);
  console.log("selected file",selectedglbmodal)

  useEffect(() => {
    if (cameraState.current && isOpened) {
      setShouldLerp(true);
      setTimeout(() => {
        setShouldLerp(false);
      }, 2000);
    } else if (playAnimation === "Badge going back in") {
      setShouldLerp(true);
    }
  }, [isOpened]);

  useEffect(() => {
    console.log("Animation Change Called");
    if (playAnimation === "Case open") {
      if (actions["idle case"]) actions["idle case"].stop();

      if (actions["Case open"]) {
        const actionOpen = actions["Case open"];
        actionOpen.reset().setLoop(THREE.LoopOnce, 1).play();

        actionOpen.clampWhenFinished = true;
        actionOpen.paused = false;

        actionOpen.getMixer().addEventListener("finished", (e) => {
          if (e.action === actionOpen) {
            setIsOpenedFinished(true);
            setIsClosedFinished(false);
          }
        });
      }
    } else if (playAnimation === "Case closing and idle") {
      if (actions["Case open"]) actions["Case open"].stop();
      if (actions["Case closing and idle"]) {
        const actionClose = actions["Case closing and idle"];
        actionClose.reset().setLoop(THREE.LoopOnce, 1).play();

        actionClose.clampWhenFinished = true;
        actionClose.paused = false;

        actionClose.getMixer().addEventListener("finished", (e) => {
          if (e.action === actionClose) {
            actionClose.stop();
            setIsClosedFinished(true);
            if (actions["idle case"]) {
              actions["idle case"]
                .reset()
                .setLoop(THREE.LoopRepeat, Infinity)
                .play();
            }
          }
        });
      }
    } else if (playAnimation === "Badge coming out") {
      if (actions["Badge coming out"]) {
        const actionBadgeOut = actions["Badge coming out"];
        actionBadgeOut.setLoop(THREE.LoopOnce, 1).play();
        actionBadgeOut.timeScale = 0.6;

        actionBadgeOut.clampWhenFinished = true;
        actionBadgeOut.paused = false;

        actionBadgeOut.getMixer().addEventListener("finished", (e) => {
          if (e.action === actionBadgeOut) {
            const badgeIdle = actions["Badge idle"];
            badgeIdle.reset();

            badgeIdle.crossFadeFrom(actionBadgeOut, 2, true);
            badgeIdle.setLoop(THREE.LoopRepeat, Infinity);

            badgeIdle.play();

            setIsShowOutFinished(true);
            setIsClosedFinished(false);
          }
        });
      }
    } else if (playAnimation === "Badge going back in") {
      if (actions["Badge idle"]) {
        actions["Badge idle"].crossFadeTo(
          actions["Badge going back in"],
          1.5,
          false
        );
        // actions['Badge idle'].stop();
      }
      setTimeout(() => {
        if (actions["idle case"]) actions["idle case"].stop();
        // if (actions["Case open"]) actions["Case open"].stop();
        if (actions["Badge coming out"]) actions["Badge coming out"].stop();

        if (actions["Badge going back in"]) {
          const actionBadgeIn = actions["Badge going back in"];
          actionBadgeIn.stop();
          actionBadgeIn.timeScale = 0.5;

          actionBadgeIn.clampWhenFinished = true;
          actionBadgeIn.paused = false;
          setTimeout(() => {
            setIsShowOutFinished(false);
            setIsOpenedFinished(true);
          }, 2000);
          actionBadgeIn.getMixer().addEventListener("finished", (e) => {
            if (e.action === actionBadgeIn) {
              setIsShowOutFinished(false);
              setIsOpenedFinished(true);

              // setIsClosedFinished(true);
            }
          });
        }
      }, 500);
    } else if (playAnimation === "idle case") {
      if (actions["idle case"]) {
        setShouldLerp(true);
        const actionClose = actions["idle case"];

        actionClose.reset().setLoop(THREE.LoopRepeat, Infinity).play();
      }
    }
  }, [playAnimation, selectedglbmodal]);

  useFrame(() => {
    if (cameraState.current && isOpened) {
      // if (shouldLerp) {
      cameraState.current.position.lerp(vec.set(0, 2.5, 2), 0.01);
      // }

      // cameraRef.current.position.set(0, 2, 2);
      // cameraState.current.lookAt(0, 2, 2);
    } else if (cameraState.current) {
      // if (shouldLerp) {
      cameraState.current.position.lerp(vec.set(0, 4.6, 4.5), 0.01);
      // }

      // cameraRef.current.position.set(0, 3.6, 3.5);
      // cameraState.current.lookAt(0, 0, 0);
    }
  });
  useEffect(() => {
    console.log("actions are:", names);
  }, []);

  return <primitive object={scene} />;
}

useGLTF.preload(glbFile);
