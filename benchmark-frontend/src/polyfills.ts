// src/polyfills.ts
(window as any).global = window;

// Optional, if needed later:
import { Buffer } from 'buffer';
(window as any).Buffer = Buffer;

import * as process from 'process';
(window as any).process = process;
