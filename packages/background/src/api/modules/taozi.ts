export function requestUploadAsset(option: {
  src: string;
  isCompressed: boolean;
  width: number;
  height: number;
}): Promise<string> {
  const { src, isCompressed, width, height } = option;
  return fetch(`https://chrome-extension-service-test.100cbc.com/oss/upload`, {
    method: "POST",
    body: JSON.stringify({
      imgUrl: src,
      isCompressed,
      size: { width, height }
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(res => {
      const { code, data, message } = res;

      if (code !== 1) {
        throw new Error(message);
      }

      return data.remoteUrl;
    });
}
