'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const TOUR_KEY = 'prompt-maker-tour-seen';

/**
 * Runs a Driver.js guided tour the first time the user visits.
 * Marks completion in localStorage so it never shows again.
 * @param isReady - wait until the app has loaded before starting
 */
export function useTour(isReady: boolean) {
  useEffect(() => {
    if (!isReady) return;

    const seen = localStorage.getItem(TOUR_KEY);
    if (seen === 'true') return;

    // Wait for DOM elements to be rendered before highlighting them
    const timer = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        progressText: '{{current}} / {{total}}',
        nextBtnText: 'Next →',
        prevBtnText: '← Back',
        doneBtnText: '🚀 Get Started!',
        allowClose: true,
        popoverClass: 'prompt-maker-tour',
        onDestroyStarted: () => {
          localStorage.setItem(TOUR_KEY, 'true');
          driverObj.destroy();
        },
        steps: [
          {
            popover: {
              title: '👋 Welcome to Prompt Maker!',
              description:
                'This quick tour shows you how to build AI prompts visually — no coding needed. It only takes a minute!',
              side: 'over',
              align: 'center',
            },
          },
          {
            element: '#tour-menu',
            popover: {
              title: '📦 Add Nodes',
              description:
                'Click this button to open the node menu. Choose a type (Text, Code, System…) and it appears on the canvas. Each node holds a piece of your prompt.',
              side: 'right',
              align: 'start',
            },
          },
          {
            element: '#tour-toolbar',
            popover: {
              title: '🛠 Toolbar',
              description:
                '<b>↩ / ↪</b> Undo & Redo your last actions.<br><br>' +
                '<b>Arrow</b>: click any node to open its editor.<br>' +
                '<b>Lasso</b>: drag to select multiple nodes at once.<br>' +
                '<b>Eraser</b>: scribble over nodes or arrows to delete them.',
              side: 'bottom',
              align: 'center',
            },
          },
          {
            element: '.react-flow__renderer',
            popover: {
              title: '🔗 Connecting Nodes',
              description:
                'Hover slowly over a node and <b>orange dots</b> will appear on its sides. ' +
                '<b>Drag from one dot to another node\'s dot</b> to draw an arrow. ' +
                'The final prompt follows those arrows from the first node to the last.',
              side: 'top',
              align: 'center',
            },
          },
          {
            element: '#tour-view-result',
            popover: {
              title: '✨ See Your Final Prompt',
              description:
                'Once your flow is ready, click here to assemble all the pieces into a single AI prompt. ' +
                'You can copy it as Markdown or preview it formatted.',
              side: 'top',
              align: 'end',
            },
          },
        ],
      });

      driverObj.drive();
    }, 900);

    return () => clearTimeout(timer);
  }, [isReady]);
}
