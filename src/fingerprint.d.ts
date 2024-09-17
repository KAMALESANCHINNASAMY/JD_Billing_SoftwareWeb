// src/fingerprint.d.ts
declare namespace Fingerprint {
    class Reader {
      onSamplesAcquired: (event: any) => void;
      onErrorOccurred: (error: any) => void;
      startAcquisition(): void;
      stopAcquisition(): void;
    }
  
    interface Sample {
      image: Blob;
      template: ArrayBuffer;
    }
  }
  