onmessage = event => {
  const { data } = event;

  postMessage(
    data.map(channel => {
      channel.forEach((value, i) => {
        if (Math.random() < 0.0000005) {
          const size = Math.ceil(Math.random() * 15000 + 5000);
          const offset = Math.ceil(Math.random() * 15000);
          const isCopy = Math.random() < 0.5;
          for (let j = 0; j < size; j += 1) {
            const index1 =
              i + j + offset < channel.length
                ? i + j + offset
                : i + j + offset - channel.length;
            const index2 =
              index1 + size < channel.length
                ? index1 + size
                : index1 + size - channel.length;

            if (isCopy) {
              channel[index2] = channel[index1];
            } else {
              const tmp = channel[index2];
              channel[index2] = channel[index1];
              channel[index1] = tmp;
            }
          }
        }

        if (Math.random() < 0.0000005) {
          const size = Math.max(
            Math.ceil(Math.random() * 15000 + 5000),
            channel.length - i
          );
          channel.set(channel.slice(i, size).reverse(), i);
        }

        if (Math.random() < 0.00001) {
          channel[i] = Math.random() * 0.2 - 0.1;
        }
      });
      return channel;
    })
  );
};
