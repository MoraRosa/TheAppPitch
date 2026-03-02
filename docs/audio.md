# ElevenLabs Audio Integration

## Current behaviour

When you hit **AUTO** in the presenter, the app waits 5 seconds then moves to the next slide automatically. That's all it does right now — no audio, just a timer.

---

## When you're ready to add voice narration

### Step 1 — Make the audio files

Go to [ElevenLabs](https://elevenlabs.io), type out what you want said for each slide, generate it, and download it. Name the files exactly like this:

```
slide-01.mp3
slide-02.mp3
slide-03.mp3
...
slide-10.mp3
```

Drop all 10 files into `public/audio/` in your repo.

---

### Step 2 — Update `src/data/audio.js`

Open `src/data/audio.js` and make two changes:

**1. Flip the enable flag:**
```js
export const AUDIO_ENABLED = true;  // was false
```

**2. Fill in the duration for each slide** (in milliseconds):
```js
export const SLIDE_AUDIO = [
  { slideId: 1,  file: 'slide-01.mp3', duration: 14000 }, // 14 seconds
  { slideId: 2,  file: 'slide-02.mp3', duration: 22000 }, // 22 seconds
  { slideId: 3,  file: 'slide-03.mp3', duration: 18000 }, // 18 seconds
  // ... and so on for all 10 slides
];
```

> **Quick conversion:** seconds × 1000 = milliseconds. A 14-second clip = `14000`.

---

## How it works once enabled

When someone hits **AUTO** in the presenter:

1. Slide 1 appears and the narration starts playing automatically
2. The moment the audio clip **finishes talking**, the app moves to slide 2 and plays that narration
3. This continues through all 10 slides

It no longer uses a timer — it listens for the audio to actually end, so the timing is always perfect regardless of how long each clip is.

---

## Updating a clip later

If you re-record a slide and the new clip is a different length, just update that one `duration` number in `audio.js`. Nothing else in the app changes.

---

## Fallback behaviour

| Situation | What happens |
|-----------|-------------|
| `AUDIO_ENABLED = false` | Timer-based auto-play (5 sec default) |
| `AUDIO_ENABLED = true`, file missing | Falls back to the `duration` value as a timer |
| `AUDIO_ENABLED = true`, file present | Audio plays, slide advances on `audio.onended` |