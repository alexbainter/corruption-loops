import Tone from 'tone';
import fetchSpecFile from '@generative-music/samples.generative.fm/browser-client';
import CorruptionWorker from './corrupt.worker';
import sampleFormat from './sample-format';

const NOTES = ['C3', 'G3', 'E3', 'C4', 'G4', 'E4', 'C5'];

const corruptionWorker = new CorruptionWorker();

const getSampler = samplesByNote =>
  new Promise(resolve => {
    const filteredSamplesByNote = Reflect.ownKeys(samplesByNote)
      .filter(note => {
        const pc = note.charAt(0);
        const oct = note.charAt(note.length - 1);
        return ['3', '4'].includes(oct) || (oct === '5' && pc === 'C');
      })
      .reduce((newSamplesByNote, note) => {
        newSamplesByNote[note] = samplesByNote[note];
        return newSamplesByNote;
      }, {});
    const buffer = new Tone.Sampler(filteredSamplesByNote, {
      onload: () => resolve(buffer),
      release: 5,
      curve: 'linear',
    }).toMaster();
  });

const generateBuffer = durationInSeconds => {
  const { sampleRate } = Tone.context;
  const originalContext = Tone.context;
  if (!originalContext.Transport) {
    originalContext.Transport = Tone.Transport;
  }
  const offlineContext = new Tone.OfflineContext(
    2,
    durationInSeconds,
    sampleRate
  );
  Tone.context = offlineContext;
  return fetchSpecFile().then(({ samples }) =>
    getSampler(samples['vsco2-piano-mf'][sampleFormat]).then(sampler => {
      NOTES.forEach(note => {
        sampler.triggerAttack(note, Math.random() * 5);
      });
      const renderPromise = offlineContext.render();
      return renderPromise.then(buffer => {
        sampler.dispose();
        Tone.Transport.stop();
        Tone.Transport.cancel();
        Tone.context = originalContext;
        return new Tone.Buffer(buffer);
      });
    })
  );
};

const music = () =>
  generateBuffer(10).then(originalBuffer => {
    const reverb = new Tone.Reverb(10).set({ wet: 1 }).toMaster();
    reverb.generate();
    let bufferData = originalBuffer.toArray();

    corruptionWorker.onmessage = event => {
      const { data } = event;
      bufferData = data;
    };

    const iterate = () => {
      const buffer = new Tone.Buffer().fromArray(bufferData);

      const bufferSource = new Tone.BufferSource(buffer).connect(reverb).set({
        onended: () => {
          bufferSource.dispose();
          buffer.dispose();
        },
      });
      bufferSource.start('+1');

      corruptionWorker.postMessage(bufferData);

      Tone.Transport.scheduleOnce(() => {
        iterate();
      }, `+${originalBuffer.duration}`);
    };

    return () => {
      iterate();
      Tone.Transport.start();
    };
  });

export default music;
