'use client';
import { useEffect } from 'react';
export function HydrationProbe(){useEffect(()=>{document.documentElement.dataset.aklHydrated='true';},[]);return null;}
