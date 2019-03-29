import Tone from 'tone';

const getBuffer = () =>
  new Promise(resolve => {
    const buffer = new Tone.Buffer('./organ.wav', () => resolve(buffer));
  });

const iterate1 = buffer => {
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

  const bufferCopy = buffer.slice(0);
  const channel1Data = bufferCopy.getChannelData(0);
  const channel2Data = bufferCopy.getChannelData(1);
  for (let i = 0, step = 1; i < buffer.length; i += step) {
    step = 1;
    if (Math.random() < 0.000001) {
      step = Math.min(Math.ceil(Math.random() * 10000), buffer.length - 1 - i);
      const isSwap = Math.random() < 0.5;
      for (let j = i; j < i + step; j += 1) {
        // if (isSwap) {
        //   const c1tmp = channel1Data[j];
        //   const c2tmp = channel2Data[j];
        //   channel1Data[j] = channel1Data[j + step];
        //   channel2Data[j] = channel2Data[j + step];
        //   channel1Data[j + step] = c1tmp;
        //   channel2Data[j + step] = c2tmp;
        // } else {
        //   channel1Data[j] = channel1Data[j + step];
        //   channel2Data[j] = channel2Data[j + step];
        // }
        const value = Math.random() * 0.25 - 0.125;
        channel1Data[j] = value;
        channel2Data[j] = value;
      }
    }
  }

  Tone.Transport.scheduleOnce(() => {
    iterate(bufferCopy);
  }, `+${bufferCopy.duration + 0.1}`);
};

getBuffer().then(originalBuffer => {
  const reverb = new Tone.Reverb(10).toMaster();
  reverb.generate();

  const iterate = isCorrupt => {
    const bufferCopy = originalBuffer.slice(0);
    const channel1Data = bufferCopy.getChannelData(0);
    const channel2Data = bufferCopy.getChannelData(1);
    const nextIsCorrupt = isCorrupt.reduce((newIsCorrupt, value, i) => {
      if (value && Math.random() < 0.5) {
        const leftNeighborIndex = i === 0 ? isCorrupt.length - 1 : i - 1;
        const rightNeighborIndex = i === isCorrupt.length - 1 ? 0 : i + 1;
        [leftNeighborIndex, rightNeighborIndex].forEach(
          neighborIndex => (newIsCorrupt[neighborIndex] = true)
        );
      }
      newIsCorrupt[i] = value || Math.random() < 0.00001;
      return newIsCorrupt;
    }, []);
    nextIsCorrupt.forEach((value, i) => {
      if (value) {
        [channel1Data, channel2Data].forEach(
          data => (data[i] = Math.random() * 0.25 - 0.125)
        );
      }
    });
    const bufferSource = new Tone.BufferSource(bufferCopy)
      .connect(reverb)
      .set({
        onended: () => {
          bufferSource.dispose();
          bufferCopy.dispose();
        },
      })
      .toMaster();
    bufferSource.start('+1');
    Tone.Draw.schedule(() => {
      const corruptCount = nextIsCorrupt.filter(v => v).length;
      console.log(`${(corruptCount / originalBuffer.length) * 100}% corrupted`);
    }, `+1`);

    Tone.Transport.scheduleOnce(() => {
      iterate(nextIsCorrupt);
    }, `+${bufferCopy.duration}`);
  };

  iterate(originalBuffer.getChannelData().map(() => false));

  Tone.Transport.start();
});
