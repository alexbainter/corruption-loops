import Tone from 'tone';
import silentAudioFile from './silence.mp3';

// "inspired by" (read: ripped off) https://github.com/tambien/StartAudioContext/blob/master/StartAudioContext.js
const startAudioContext = () => {
  const { context } = Tone;
  if (context.state && context.state !== 'running') {
    // this accomplishes the iOS specific requirement
    const buffer = context.createBuffer(1, 1, context.sampleRate);
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);

    // resume the audio context
    if (context.resume) {
      context.resume();
    }
  }

  // play a silent audio file so audio plays on iOS devices in silent mode
  const audio = document.createElement('audio');
  audio.src = silentAudioFile;
  audio.loop = true;
  audio.play();
};

export default startAudioContext;
