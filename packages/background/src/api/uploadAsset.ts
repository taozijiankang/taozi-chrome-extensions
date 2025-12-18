export function requestUploadAsset(option: {
  src: string;
  isCompressed: boolean;
  width: number;
  height: number;
}): Promise<string> {
  const { src, isCompressed, width, height } = option;
  return fetch(src)
    .then((res) => res.blob())
    .then((blob) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    })
    .then((dataUrl) => {
      return fetch(`https://chrome-extension-service-test.100cbc.com/oss/upload`, {
        method: "POST",
        body: JSON.stringify({
          imgUrl: dataUrl,
          isCompressed,
          size: { width, height },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          const { code, data, message } = res;

          if (code !== 1) {
            throw new Error(message);
          }

          return data.remoteUrl;
        });
    });
}
