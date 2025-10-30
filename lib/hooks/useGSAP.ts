'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const useGSAP = (callback: () => gsap.core.Tween | gsap.core.Timeline | void, deps: any[] = []) => {
  const ctx = useRef<gsap.Context | null>(null);

  useEffect(() => {
    ctx.current = gsap.context(() => {
      callback();
    });

    return () => ctx.current?.revert();
  }, deps);
};
