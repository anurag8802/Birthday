import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, Heart, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const publicAsset = (path) => `${import.meta.env.BASE_URL}${path}`;
const photos = Array.from({ length: 35 }, (_, index) => ({
  src: publicAsset(`photos/memory-${String(index + 1).padStart(2, '0')}.jpeg`),
}));
const goalPhotos = [
  publicAsset('goel/goal-01.jpeg'),
  publicAsset('goel/goal-02-wedding.jpeg'),
  publicAsset('goel/goal-02.jpeg'),
  publicAsset('goel/goal-03.jpeg'),
  publicAsset('goel/goal-04.jpeg'),
  publicAsset('goel/goal-05.jpeg'),
  publicAsset('goel/goal-06.jpeg'),
  publicAsset('goel/goal-07.jpeg'),
];
const goalCaptions = ['The end goal', 'Our wedding day', 'Bringing our families together', 'A little home of our own', 'Our own little family', 'Seeing the world side by side', 'Making each other’s dreams come true', 'Choosing each other, even after a disagreement'];
const captions = ['Celebrating you', 'Make a wish', 'Happy birthday!', 'Little moments, big memories', 'My favorite person', 'Here for every adventure', 'A day as lovely as you', 'More reasons to smile', 'The best kind of company', 'Keep shining', 'A memory to keep', 'You make life sweeter', 'Always in my corner', 'Here is to your next chapter', 'So lucky to know you', 'The best days are ours', 'My favorite smile', 'Side by side, always', 'A little bit of magic', 'Everyday feels brighter', 'Our kind of happy', 'A moment worth keeping', 'Still my favorite view', 'More memories to make', 'You and me, just right', 'To all the days ahead', 'A little sunshine together', 'Your beautiful smile', 'Right where I belong', 'Lost in your smile', 'Just us', 'My favorite people', 'A little mischief', 'Our kind of date', 'Happy looks good on us'];
const steps = ['Welcome', 'Balloons', 'Cake', 'Roses', 'Memories', 'Letter', 'Love', 'Our future', 'Video', 'Gift'];
const balloonWords = ['You', 'are', 'so', 'special'];

export default function App() {
  const [step, setStep] = useState(0);
  const [popped, setPopped] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [specialSoundPlaying, setSpecialSoundPlaying] = useState(false);
  const [candleSoundPlaying, setCandleSoundPlaying] = useState(false);
  const [candleOut, setCandleOut] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [letterOpen, setLetterOpen] = useState(false);
  const [loveTaps, setLoveTaps] = useState(0);
  const [loveStarted, setLoveStarted] = useState(false);
  const [loveShattered, setLoveShattered] = useState(false);
  const [loveBroken, setLoveBroken] = useState(false);
  const [goalPhotoIndex, setGoalPhotoIndex] = useState(0);
  const [videoStarted, setVideoStarted] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [bouquetImageLoaded, setBouquetImageLoaded] = useState(false);
  const galleryRef = useRef(null);
  const videoRef = useRef(null);
  const backgroundAudioRef = useRef(null);
  const popAudioContextRef = useRef(null);
  const touchStart = useRef(null);

  useEffect(() => {
    if (step === 1 && popped.length === 4) {
      const timer = window.setTimeout(() => {
        backgroundAudioRef.current?.pause();
        setRevealed(true);
        setSpecialSoundPlaying(true);
      }, 1500);
      return () => window.clearTimeout(timer);
    }
  }, [popped, step]);

  useEffect(() => {
    if (!specialSoundPlaying) return undefined;

    const AudioContextType = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextType) {
      const timer = window.setTimeout(() => setSpecialSoundPlaying(false), 1200);
      return () => window.clearTimeout(timer);
    }

    const audioContext = popAudioContextRef.current ?? new AudioContextType();
    popAudioContextRef.current = audioContext;
    const timer = window.setTimeout(() => setSpecialSoundPlaying(false), 1200);

    audioContext.resume().then(() => {
      const notes = [659.25, 783.99, 987.77, 1318.51];
      const start = audioContext.currentTime;

      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const volume = audioContext.createGain();
        const noteStart = start + index * 0.16;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, noteStart);
        volume.gain.setValueAtTime(0.0001, noteStart);
        volume.gain.exponentialRampToValueAtTime(0.18, noteStart + 0.025);
        volume.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.55);
        oscillator.connect(volume);
        volume.connect(audioContext.destination);
        oscillator.start(noteStart);
        oscillator.stop(noteStart + 0.56);
      });
    }).catch((error) => {
      window.clearTimeout(timer);
      setSpecialSoundPlaying(false);
      console.error('Unable to play the special reveal sound.', error);
    });

    return () => window.clearTimeout(timer);
  }, [specialSoundPlaying]);

  useEffect(() => {
    if (!candleSoundPlaying) return undefined;

    const timer = window.setTimeout(() => setCandleSoundPlaying(false), 850);
    const AudioContextType = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextType) return () => window.clearTimeout(timer);

    const audioContext = popAudioContextRef.current ?? new AudioContextType();
    popAudioContextRef.current = audioContext;
    audioContext.resume().then(() => {
      const duration = 0.75;
      const buffer = audioContext.createBuffer(1, Math.ceil(audioContext.sampleRate * duration), audioContext.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let sample = 0; sample < samples.length; sample += 1) {
        samples[sample] = Math.random() * 2 - 1;
      }

      const whoosh = audioContext.createBufferSource();
      const filter = audioContext.createBiquadFilter();
      const volume = audioContext.createGain();
      const start = audioContext.currentTime;
      whoosh.buffer = buffer;
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, start);
      filter.frequency.exponentialRampToValueAtTime(180, start + duration);
      volume.gain.setValueAtTime(0.0001, start);
      volume.gain.exponentialRampToValueAtTime(0.24, start + 0.08);
      volume.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      whoosh.connect(filter);
      filter.connect(volume);
      volume.connect(audioContext.destination);
      whoosh.start(start);
      whoosh.stop(start + duration);
    }).catch((error) => {
      window.clearTimeout(timer);
      setCandleSoundPlaying(false);
      console.error('Unable to play the candle blow sound.', error);
    });

    return () => window.clearTimeout(timer);
  }, [candleSoundPlaying]);

  useEffect(() => {
    if (confetti) {
      const timer = window.setTimeout(() => setConfetti(false), 3200);
      return () => window.clearTimeout(timer);
    }
  }, [confetti]);

  useEffect(() => {
    if (step !== 6 || !loveStarted || loveBroken || loveTaps >= 8) return undefined;
    const timer = window.setTimeout(() => setLoveTaps((value) => Math.min(value + 1, 8)), 230);
    return () => window.clearTimeout(timer);
  }, [loveBroken, loveStarted, loveTaps, step]);

  useEffect(() => {
    if (step === 6 && loveStarted && loveTaps >= 8 && !loveShattered) {
      const timer = window.setTimeout(() => setLoveShattered(true), 180);
      return () => window.clearTimeout(timer);
    }
  }, [loveShattered, loveStarted, loveTaps, step]);

  useEffect(() => {
    if (step === 6 && loveShattered && !loveBroken) {
      const timer = window.setTimeout(() => setLoveBroken(true), 950);
      return () => window.clearTimeout(timer);
    }
  }, [loveBroken, loveShattered, step]);

  useEffect(() => {
    if (step !== 7) return undefined;
    const timer = window.setInterval(() => setGoalPhotoIndex((index) => (index + 1) % goalPhotos.length), 3000);
    return () => window.clearInterval(timer);
  }, [step]);

  useEffect(() => {
    const audio = backgroundAudioRef.current;
    if (!audio) return;
    if (step === 9) {
      audio.pause();
      if (musicEnabled) setMusicEnabled(false);
      return;
    }
    if (step === 3) {
      audio.pause();
      return;
    }
    if (specialSoundPlaying || candleSoundPlaying) {
      setMusicEnabled(true);
      return;
    }
    if (!musicEnabled || videoStarted || specialSoundPlaying || candleSoundPlaying) {
      audio.pause();
      return;
    }
    audio.loop = true;
    audio.volume = 0.35;
    audio.play().catch(() => setMusicEnabled(false));
  }, [candleSoundPlaying, musicEnabled, specialSoundPlaying, step, videoStarted]);

  useEffect(() => {
    if (step !== 3 || !musicEnabled) return undefined;

    const AudioContextType = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextType) return undefined;

    const audioContext = popAudioContextRef.current ?? new AudioContextType();
    popAudioContextRef.current = audioContext;
    let active = true;
    let timer;

    function playClap() {
      if (!active) return;

      const start = audioContext.currentTime;
      const duration = 0.09;
      const buffer = audioContext.createBuffer(1, Math.ceil(audioContext.sampleRate * duration), audioContext.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let sample = 0; sample < samples.length; sample += 1) {
        samples[sample] = Math.random() * 2 - 1;
      }

      const clap = audioContext.createBufferSource();
      const filter = audioContext.createBiquadFilter();
      const volume = audioContext.createGain();
      clap.buffer = buffer;
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100 + Math.random() * 800, start);
      filter.Q.setValueAtTime(0.8, start);
      volume.gain.setValueAtTime(0.0001, start);
      volume.gain.exponentialRampToValueAtTime(0.2, start + 0.004);
      volume.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      clap.connect(filter);
      filter.connect(volume);
      volume.connect(audioContext.destination);
      clap.start(start);
      clap.stop(start + duration);

      timer = window.setTimeout(playClap, 130 + Math.random() * 150);
    }

    audioContext.resume().then(() => {
      if (active) playClap();
    }).catch((error) => {
      console.error('Unable to play the applause sound.', error);
    });

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [musicEnabled, step]);

  useEffect(() => {
    if (step !== 8 && videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, [step]);

  function movePhoto(direction) {
    const index = (photoIndex + direction + photos.length) % photos.length;
    setPhotoIndex(index);
    galleryRef.current?.scrollTo({ left: galleryRef.current.clientWidth * index, behavior: 'smooth' });
  }

  function popBalloon(index) {
    if (popped.includes(index)) return;

    if (typeof window !== 'undefined') {
      const AudioContextType = window.AudioContext || window.webkitAudioContext;
      if (AudioContextType) {
        const audioContext = popAudioContextRef.current ?? new AudioContextType();
        popAudioContextRef.current = audioContext;

        audioContext.resume().then(() => {
          const now = audioContext.currentTime;
          const pop = audioContext.createOscillator();
          const popVolume = audioContext.createGain();
          pop.type = 'sine';
          pop.frequency.setValueAtTime(240, now);
          pop.frequency.exponentialRampToValueAtTime(55, now + 0.12);
          popVolume.gain.setValueAtTime(0.35, now);
          popVolume.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          pop.connect(popVolume);
          popVolume.connect(audioContext.destination);
          pop.start(now);
          pop.stop(now + 0.12);

          const noiseBuffer = audioContext.createBuffer(1, Math.ceil(audioContext.sampleRate * 0.045), audioContext.sampleRate);
          const noiseData = noiseBuffer.getChannelData(0);
          for (let sample = 0; sample < noiseData.length; sample += 1) {
            noiseData[sample] = Math.random() * 2 - 1;
          }
          const noise = audioContext.createBufferSource();
          const noiseFilter = audioContext.createBiquadFilter();
          const noiseVolume = audioContext.createGain();
          noise.buffer = noiseBuffer;
          noiseFilter.type = 'lowpass';
          noiseFilter.frequency.setValueAtTime(1400, now);
          noiseVolume.gain.setValueAtTime(0.16, now);
          noiseVolume.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
          noise.connect(noiseFilter);
          noiseFilter.connect(noiseVolume);
          noiseVolume.connect(audioContext.destination);
          noise.start(now);
          noise.stop(now + 0.045);
        }).catch((error) => {
          console.error('Unable to play the balloon pop sound.', error);
        });
      }

      if (typeof navigator.vibrate === 'function') {
        navigator.vibrate(35);
      }
    }

    setPopped((current) => current.includes(index) ? current : [...current, index]);
  }

  function reset() {
    setStep(0); setPopped([]); setRevealed(false); setSpecialSoundPlaying(false); setCandleSoundPlaying(false); setCandleOut(false);
    setPhotoIndex(0); setLetterOpen(false); setLoveTaps(0); setLoveStarted(false); setLoveShattered(false); setLoveBroken(false); setGiftOpen(false);
    setGoalPhotoIndex(0); setVideoStarted(false); setMusicEnabled(false);
  }

  function toggleBackgroundMusic() {
    const audio = backgroundAudioRef.current;
    if (!audio) return;
    if (musicEnabled) {
      audio.pause();
      setMusicEnabled(false);
      return;
    }
    audio.loop = true;
    audio.volume = 0.35;
    setMusicEnabled(true);
    if (step !== 3) audio.play().catch(() => setMusicEnabled(false));
  }

  function blowOutCandle() {
    if (candleOut) return;
    backgroundAudioRef.current?.pause();
    setCandleOut(true);
    setCandleSoundPlaying(true);
  }

  async function playSurpriseVideo() {
    try {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = 1;
      }
      await videoRef.current?.play();
      setVideoStarted(true);
    } catch {
      setVideoStarted(false);
    }
  }

  return (
    <main className={`app-shell step-${step}`}>
      <audio ref={backgroundAudioRef} src={publicAsset('audio/birthday-music.mp3')} preload="none" loop />
      <div className="ambient ambient-one" aria-hidden="true" /><div className="ambient ambient-two" aria-hidden="true" />
      {step > 0 && <div className="welcome-decor story-decor" aria-hidden="true"><i>✦</i><i>♡</i><i>♥</i><i>✧</i><i>♥</i><i>♡</i><i>✦</i><i>♥</i><i>✧</i><i>♡</i><i>♥</i><i>✦</i></div>}
      {confetti && <div className="confetti" aria-hidden="true">{Array.from({ length: 34 }, (_, i) => <i key={i} />)}</div>}
      {step === 0 && <header className="welcome-appbar"><span className="app-mark"><Heart size={17} fill="currentColor" /></span><span className="app-brand-copy"><strong>A Birthday Surprise</strong><small>Made just for Kukki ♡</small></span><button className="music-toggle" onClick={toggleBackgroundMusic} aria-label={musicEnabled ? 'Turn birthday music off' : 'Turn birthday music on'} title={musicEnabled ? 'Birthday music on' : 'Birthday music off'}>{musicEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}</button><span className="welcome-chip">FOR YOU <Heart size={12} fill="currentColor" /></span></header>}
      {step > 0 && <header className="story-top">
        <div className="story-toolbar"><button className="back-button" onClick={() => setStep((value) => Math.max(value - 1, 0))} aria-label="Go back"><ArrowLeft size={19} /></button><span className="app-mark story-mark"><Heart size={15} fill="currentColor" /></span><span className="story-brand">Birthday Surprise</span><button className="music-toggle" onClick={toggleBackgroundMusic} aria-label={musicEnabled ? 'Turn birthday music off' : 'Turn birthday music on'} title={musicEnabled ? 'Birthday music on' : 'Birthday music off'}>{musicEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}</button><span className="step-count">{String(step + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</span></div>
        <div className="progress" aria-label={`Step ${step + 1} of ${steps.length}`}>{steps.map((label, index) => <span key={label} className={index <= step ? 'active' : ''} />)}</div>
      </header>}

      {step === 0 && <section className="scene welcome-scene" key="welcome">
        <div className="welcome-decor" aria-hidden="true"><i>✦</i><i>♡</i><i>♥</i><i>✧</i><i>♥</i><i>♡</i><i>✦</i><i>♥</i><i>✧</i><i>♡</i><i>♥</i><i>✦</i></div>
        <div className="welcome-copy"><p className="eyebrow">♥</p><h1 className="welcome-title"><span className="title-main">Happy Birthday</span><span className="title-signature">Kukki Bubu <span aria-hidden="true">♡</span></span></h1><p className="intro-line">Today is all about you.</p></div>
        <div className="welcome-prompt"><p>Are you excited for what’s next?</p><div className="button-row"><button className="button button-primary" onClick={() => { if (!musicEnabled) toggleBackgroundMusic(); setStep(1); }}>Yes, let’s go <ArrowRight size={17} /></button><button className="button button-quiet" onClick={() => setNoCount((value) => value + 1)}>{noCount ? 'Okay, fine!' : 'Not yet'}</button></div>{noCount > 0 && <span className="tease-note">This surprise is patient. You can take your time.</span>}</div>
        <p className="welcome-footer"><span>♥</span> A LITTLE JOY, MADE FOR KUKKI <span>♥</span></p>
      </section>}

      {step === 1 && <section className="scene balloons-scene" key="balloons">
        <div className="scene-heading"><p className="eyebrow">First, a tiny challenge</p><h2>{revealed ? 'A little reminder' : 'Pop all 4 balloons'}</h2><p className="scene-subtitle">{revealed ? 'Keep this close, birthday girl.' : `${4 - popped.length} left · tap each balloon to pop it.`}</p></div>
        {!revealed ? <div className="balloon-grid">{['blue', 'pink', 'mint', 'lilac'].map((color, index) => <button key={color} className={`balloon ${color} ${popped.includes(index) ? 'popped' : ''}`} onClick={() => popBalloon(index)} aria-label={popped.includes(index) ? balloonWords[index] : `Pop ${color} balloon`} disabled={popped.includes(index)}>{popped.includes(index) ? <span className="balloon-word">{balloonWords[index]}</span> : <><i className="balloon-shine" /><i className="balloon-knot" /><i className="balloon-string" /><span className="balloon-number">0{index + 1}</span></>}</button>)}</div> : <div className="special-message" aria-live="polite"><span className="message-star">✳</span><p><span>You</span><span>are</span><strong>so special</strong></p><span className="message-heart">♥</span></div>}
        {revealed && <button className="button button-primary scene-cta" onClick={() => setStep(2)}>On to the cake <ArrowRight size={17} /></button>}
      </section>}

      {step === 2 && <section className="scene candle-scene" key="candle">
        <div className="scene-heading"><p className="eyebrow">Make a wish</p><h2>Blow out your candle, <em>Kumkum</em></h2><p className="scene-subtitle">A wish made today deserves to come true.</p></div>
        <button className={`single-cake ${candleOut ? 'blown' : ''}`} onClick={blowOutCandle} aria-label={candleOut ? 'Candle blown out' : 'Tap to blow out the candle'}><img src={publicAsset('images/birthday-cake.png')} alt="A birthday cake for Kumkum" /></button>
        {!candleOut && <button className="tap-bar" onClick={blowOutCandle}>✧ <span>Tap the candle to blow</span></button>}
      </section>}
      {step === 2 && candleOut && createPortal(<div className="wish-screen" role="dialog" aria-modal="true" aria-label="Make a birthday wish"><div className="wish-card"><span className="wish-card-star">✦</span><p className="wish-card-eyebrow">A moment just for you</p><h2>Close your eyes<br />&amp; make a wish</h2><p className="wish-card-note">Take a quiet breath and wish for something wonderful.</p><button className="button wish-confirm" onClick={() => { setConfetti(true); setStep(3); }}>Wish made <Heart size={16} fill="currentColor" /></button></div></div>, document.body)}

      {step === 3 && <section className="scene roses-scene" key="roses"><div className="scene-heading align-left"><p className="eyebrow">A bouquet, just for you</p><h2>Your rose &amp; sunflower bouquet<span className="rose-mark">✿</span></h2></div>
        <img className="bouquet-photo" src={publicAsset('images/bouquet.jpg')} alt="A red rose and sunflower bouquet" onLoad={() => setBouquetImageLoaded(true)} onError={(event) => { event.currentTarget.hidden = true; }} />
        {!bouquetImageLoaded && <div className="bouquet-art" role="img" aria-label="A hand-tied bouquet of red roses and yellow sunflowers">
        <div className="bouquet-foliage">{Array.from({ length: 11 }, (_, index) => <i key={index} style={{ '--leaf-index': index }} />)}</div>
        <div className="bouquet-stems"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <div className="bouquet-paper"><span /><span /></div>
        <div className="bouquet-flowers">{[
          { kind: 'sunflower', x: 23, y: 31, delay: 0 }, { kind: 'rose', x: 39, y: 24, delay: 1 }, { kind: 'rose', x: 57, y: 26, delay: 2 }, { kind: 'sunflower', x: 76, y: 33, delay: 3 },
          { kind: 'rose', x: 15, y: 48, delay: 4 }, { kind: 'sunflower', x: 32, y: 43, delay: 5 }, { kind: 'rose', x: 49, y: 48, delay: 6 }, { kind: 'sunflower', x: 67, y: 43, delay: 7 }, { kind: 'rose', x: 84, y: 49, delay: 8 },
          { kind: 'rose', x: 25, y: 63, delay: 9 }, { kind: 'sunflower', x: 45, y: 59, delay: 10 }, { kind: 'rose', x: 64, y: 62, delay: 11 }, { kind: 'rose', x: 77, y: 65, delay: 12 },
        ].map((flower, index) => <span key={index} className={`bouquet-flower ${flower.kind}`} style={{ '--flower-x': `${flower.x}%`, '--flower-y': `${flower.y}%`, '--flower-delay': `${flower.delay * 55}ms` }}><i className="flower-petals" /><i className="flower-center" /></span>)}</div>
        <div className="bouquet-tie"><i /><i /></div><div className="bouquet-ribbon"><i /><i /><b /></div>
        </div>}
        <p className="rose-caption">For someone who makes every day brighter.</p><button className="button button-primary scene-cta" onClick={() => setStep(4)}>Keep going <ArrowRight size={17} /></button></section>}

      {step === 4 && <section className="scene memories-scene" key="memories"><div className="scene-heading"><p className="eyebrow">The little things are the big things</p><h2>Some sweet moments</h2><p className="scene-subtitle">A few snapshots from our story</p></div><div className="gallery-wrap" onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={(event) => { if (touchStart.current === null) return; const distance = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 44) movePhoto(distance < 0 ? 1 : -1); touchStart.current = null; }}><div className="photo-track" ref={galleryRef} onScroll={(event) => { const index = Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth); if (index !== photoIndex) setPhotoIndex(index); }}>{photos.map((photo, index) => <article className="photo-card" key={photo.src}><div className="photo-frame"><img src={photo.src} alt={`Birthday memory ${index + 1}`} loading={index < 2 ? 'eager' : 'lazy'} /><span className="photo-index">{String(index + 1).padStart(2, '0')} / {photos.length}</span></div><p>{captions[index]} <span>✦</span></p></article>)}</div><div className="gallery-controls"><button onClick={() => movePhoto(-1)} aria-label="Previous photo"><ArrowLeft size={18} /></button><div className="gallery-dots" aria-label={`Photo ${photoIndex + 1} of ${photos.length}`}>{photos.map((photo, index) => <button key={photo.src} className={photoIndex === index ? 'active' : ''} onClick={() => { setPhotoIndex(index); galleryRef.current?.scrollTo({ left: galleryRef.current.clientWidth * index, behavior: 'smooth' }); }} aria-label={`Go to photo ${index + 1}`} />)}</div><button onClick={() => movePhoto(1)} aria-label="Next photo"><ArrowRight size={18} /></button></div></div><button className="button button-primary scene-cta" onClick={() => setStep(5)}>A note from my heart <ArrowRight size={17} /></button></section>}

      {step === 5 && <section className="scene letter-scene" key="letter"><div className="scene-heading"><p className="eyebrow">A few words, only for you</p><h2>A message from my heart</h2></div><button className={`envelope ${letterOpen ? 'opened' : ''}`} onClick={() => setLetterOpen((value) => !value)} aria-label={letterOpen ? 'Close the letter' : 'Open your birthday letter'}><span className="envelope-back" /><span className="envelope-paper"><Heart size={19} fill="currentColor" /><span>For Kumkum</span></span><span className="envelope-front" /><span className="envelope-poem">Meri Aankhein Ho, Tera Chehra Ho,<br />Tere Chehre Par, Mera Pehra Ho.<br />Tujhe Mujhse Ishq Ho, Khuda Kare,<br />Jo Ishq, Samandar Se Bhi Gehra Ho. ❤️</span><span className="envelope-seal"><Heart size={20} fill="currentColor" /></span></button>{!letterOpen ? <p className="envelope-hint">Tap the envelope to open your letter</p> : <article className="letter-paper" aria-live="polite"><div className="letter-copy">
        <p style={{ animationDelay: '0ms' }}>Bubu tujhe Pata hai?</p>
        <p style={{ animationDelay: '180ms' }}>Kabhi kabhi mujhe khud smjh nahi aata ki tu mere liye itne special kaise ban gyi.Dheere dheere tu meri aadat ban gyi h.</p>
        <p style={{ animationDelay: '360ms' }}>Ab aisa lagta hai jaise din adhura sa hota hai agar teri baat na ho, teri smile na dikhe, ya tera photo na dkhu. teri har choti choti baat mujhe yaad reh jati hai. tera care karna, meri faltu baaton ko patiently sunna, bina reason mujhe hasa dena, ye sab mere dil ke bht close hai.</p>
        <p style={{ animationDelay: '540ms' }}>Aur shayad tujhe kabhi realize bhi na ho ki tune meri life ko kitna sunder bna dia hai. Kabhi kabhi life bht tiring si lagti hai, sab kuch bekar  sa lagta hai. But fir tera ek message , gallery mai rkhi hui teri photos, ya ek call sab kuch  better kar deti hai. Jaise dil ko ek sukoon mil jata hai.</p>
        <p style={{ animationDelay: '720ms' }}>tere saath baat karke lagta hai ki koi to hai jo genuinely important hai mere liye. bht log aate hain life me, kuch time ke liye saath rehte hain aur fir chale jate hain. But tu khas hai mere lia....</p>
        <p style={{ animationDelay: '900ms' }}>Tu wo feeling hai jise main kbhi khona nahi chahta. Tu mera comfort h, meri khushi h, aur meri life ka wo sunder hissa h jise main har situation me apne paas rakhna chahta hu.</p>
        <p style={{ animationDelay: '1080ms' }}>Aur pata hai sabse sunder baat kya hai? Mujhe tera perfect hona bhi zaroori nahi lagta kyuki tu perfect h mere lia. Mujhe bas tu chahiye, exactly the way you are. ❤️</p>
      </div><button className="letter-heart" aria-label="Send love" onClick={() => setConfetti(true)}><Heart size={18} fill="currentColor" /></button></article>}{letterOpen && <button className="button button-primary scene-cta" onClick={() => setStep(6)}>Measure my love <ArrowRight size={17} /></button>}</section>}

      {step === 6 && <section className="scene love-scene" key="love"><div className="scene-heading"><p className="eyebrow">One tiny question</p><h2>How much do I love you?</h2><p className="scene-subtitle">{loveStarted ? 'Look how high it goes...' : 'Tap once and watch the love rise.'}</p></div><div className={`love-meter ${loveStarted ? 'started' : ''} ${loveShattered ? 'shattered' : ''} ${loveBroken ? 'infinite-revealed' : ''}`} style={{ '--meter-fill': `${Math.min(loveTaps, 8) * 12.5}%`, '--meter-rise': `${Math.min(loveTaps, 8) * 22}px` }} aria-label={`Love meter ${Math.min(loveTaps, 8) * 12.5} percent`}><div className="meter-shell"><div className="meter-vessel"><div className="meter-fill" /><span className="meter-glow" /></div>{Array.from({ length: 8 }, (_, index) => <i className={`meter-shard shard-${index + 1}`} key={index} />)}<span className="meter-heart">♥</span></div><div className="meter-marks"><span>∞</span><span>SO MUCH LOVE</span><span>0</span></div></div>{loveBroken ? <div className="infinite-love" aria-live="polite"><span>∞</span><p>I love you infinitely</p><small>My love for you has no end.</small><button className="button button-primary scene-cta" onClick={() => setStep(7)}>The end goal <ArrowRight size={17} /></button></div> : <button className="button button-primary love-tap" onClick={() => setLoveStarted(true)} disabled={loveStarted} aria-label="Tap once to start the love meter">{loveStarted ? 'Love is rising...' : 'Tap to measure my love'} <Heart size={17} fill="currentColor" /></button>}</section>}

      {step === 7 && <section className="scene goal-scene" key="goal"><div className="scene-heading"><p className="eyebrow">A future I dream of</p><h2>The End Goal: With You</h2><p className="scene-subtitle">Every little dream is better when it’s with you.</p></div><div className="goal-photo-frame" aria-live="polite"><img key={goalPhotoIndex} src={goalPhotos[goalPhotoIndex]} alt={goalCaptions[goalPhotoIndex]} /><div className="goal-photo-caption">{goalCaptions[goalPhotoIndex]}</div><span className="goal-photo-count">{String(goalPhotoIndex + 1).padStart(2, '0')} / {goalPhotos.length}</span></div><div className="goal-dots" aria-label={`Future photo ${goalPhotoIndex + 1} of ${goalPhotos.length}`}>{goalPhotos.map((photo, index) => <button key={photo} className={goalPhotoIndex === index ? 'active' : ''} onClick={() => setGoalPhotoIndex(index)} aria-label={`Show future photo ${index + 1}`} />)}</div><button className="button button-primary scene-cta" onClick={() => setStep(8)}>One last thing <ArrowRight size={17} /></button></section>}

      {step === 8 && <section className="scene video-scene" key="video"><div className="scene-heading"><p className="eyebrow">One last thing, but not the least</p><h2>A little video for you</h2><p className="scene-subtitle">Tap play, sit back, and listen.</p></div><div className={`surprise-video-frame ${videoStarted ? 'playing' : ''}`}><video ref={videoRef} src={publicAsset('videos/birthday-surprise.mp4')} controls playsInline preload="none" muted={false} onPlay={() => { backgroundAudioRef.current?.pause(); setVideoStarted(true); }} onPause={() => setVideoStarted(false)} onEnded={() => setVideoStarted(false)} aria-label="A special birthday video for Kumkum" />{!videoStarted && <button className="video-play-button" onClick={playSurpriseVideo} aria-label="Play your birthday video"><span><Play size={25} fill="currentColor" /></span><b>Play your video</b></button>}</div><p className="video-note">Made with love, just for you ♥</p><button className="button button-primary scene-cta" onClick={() => { videoRef.current?.pause(); setStep(9); }}>One last thing <ArrowRight size={17} /></button></section>}

      {step === 9 && <section className="scene gift-scene" key="gift"><div className="scene-heading"><p className="eyebrow">Just when you thought we were done</p><h2>One last thing<span className="ellipsis">...</span></h2><p className="scene-subtitle">A little gift, wrapped up with love.</p></div>{!giftOpen ? <button className="gift-box" onClick={() => { setGiftOpen(true); setConfetti(true); }} aria-label="Open your birthday gift"><span className="gift-lid" /><span className="gift-body"><i /></span><span className="gift-ribbon" /><span className="gift-bow">🎀</span></button> : <div className="final-surprise" aria-live="polite"><div className="final-card"><span className="final-sticker">♥</span><div className="final-doodle">🐰　🐻</div><p className="script-line">Lots of love for you</p><p>Once again, happy birthday, Kukki!!<br />I Love You So Much ❤️🥹🫶🏻💖✨😘🌹💋.</p></div><button className="button button-quiet replay-button" onClick={reset}><RotateCcw size={15} /> Replay</button><div className="final-links"><span>Pass the birthday magic along</span><a href="https://heartcraft.app" target="_blank" rel="noreferrer">Write a heartfelt love letter <ArrowRight size={16} /></a></div></div>}{!giftOpen && <p className="gift-hint">Tap your gift</p>}</section>}
      {step > 0 && <footer className="page-footer"><span>✦</span> A LITTLE JOY, MADE FOR KUMKUM <span>✦</span></footer>}
    </main>
  );
}