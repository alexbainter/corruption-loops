import Tone from 'tone';
import CorruptionWorker from './corrupt.worker';

const samples = {
  A0: 'vsco2-piano-mf/ogg/ee60ddc694b005ff7268daf2adc79467.ogg',
  'C#1': 'vsco2-piano-mf/ogg/182422439680da7d0a8bc443950cae41.ogg',
  F1: 'vsco2-piano-mf/ogg/bc297b999caea5983e97cec5067d7784.ogg',
  'C#2': 'vsco2-piano-mf/ogg/feb5dbfae2251bea77d6cd5c4182c934.ogg',
  F2: 'vsco2-piano-mf/ogg/0a77f974b45e6af46ec33f6a1ff6da5a.ogg',
  A2: 'vsco2-piano-mf/ogg/894e10a4c36d4cc242fedd46118fa023.ogg',
  'C#3': 'vsco2-piano-mf/ogg/b9a27a58679169b54d279f960babca85.ogg',
  F3: 'vsco2-piano-mf/ogg/870452f3fb1e05b41c9f6dfe5e395d44.ogg',
  A3: 'vsco2-piano-mf/ogg/93980299d3e02cd3a537f56ebf6fd4d3.ogg',
  'C#4': 'vsco2-piano-mf/ogg/83856158e5a771bfc440e9a024f6f7ff.ogg',
  F4: 'vsco2-piano-mf/ogg/885959e16a70e16f8288829c080e8011.ogg',
  A4: 'vsco2-piano-mf/ogg/b6b6c128c69e2d9901b20caa4bd0a790.ogg',
  'C#5': 'vsco2-piano-mf/ogg/2117246f90b1dca86e38539d2111bd53.ogg',
  F5: 'vsco2-piano-mf/ogg/1776eb10900b09ae449b1afdf7a976bb.ogg',
  A5: 'vsco2-piano-mf/ogg/415f9023f5fa0faddea992c373b3f165.ogg',
  'C#6': 'vsco2-piano-mf/ogg/f306824f30981b18821623bdd9ac33e8.ogg',
  F6: 'vsco2-piano-mf/ogg/75f92ec8cedebd2cc28c60ef75fb86eb.ogg',
  A6: 'vsco2-piano-mf/ogg/20282454406203a58bfc3790d76627e7.ogg',
  'C#7': 'vsco2-piano-mf/ogg/c880424657f2827ad8d295214e309cb6.ogg',
  F7: 'vsco2-piano-mf/ogg/cb5e70f07d271642742ce91efc3f2342.ogg',
  A7: 'vsco2-piano-mf/ogg/32baa5c00b41a812524e115cf4c27ac9.ogg',
  C8: 'vsco2-piano-mf/ogg/936de0b66d71524d670578a66e5dc9d1.ogg',
};

const corruptionWorker = new CorruptionWorker();

const getSampler = () =>
  new Promise(resolve => {
    const buffer = new Tone.Sampler(samples, {
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
  return getSampler().then(sampler => {
    sampler.triggerAttack('C3', Math.random() * 5);
    sampler.triggerAttack('G3', Math.random() * 5);
    sampler.triggerAttack('E3', Math.random() * 5);
    sampler.triggerAttack('C4', Math.random() * 5);
    sampler.triggerAttack('G4', Math.random() * 5);
    sampler.triggerAttack('E4', Math.random() * 5);
    sampler.triggerAttack('C5', Math.random() * 5);
    const renderPromise = offlineContext.render();
    return renderPromise.then(buffer => {
      sampler.dispose();
      Tone.Transport.stop();
      Tone.Transport.cancel();
      Tone.context = originalContext;
      return new Tone.Buffer(buffer);
    });
  });
};

export default () =>
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

      const bufferSource = new Tone.BufferSource(buffer)
        .connect(reverb)
        .set({
          onended: () => {
            bufferSource.dispose();
            buffer.dispose();
          },
        })
        .toMaster();
      bufferSource.start('+1');

      corruptionWorker.postMessage(bufferData);

      Tone.Transport.scheduleOnce(() => {
        iterate();
      }, `+${originalBuffer.duration}`);
    };

    iterate();

    Tone.Transport.start();
  });
