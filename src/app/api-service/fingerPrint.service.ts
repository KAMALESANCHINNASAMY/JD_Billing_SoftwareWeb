// fingerprint.service.ts
import { Injectable } from '@angular/core';

declare const CBM_E2_SDK: any; // Assuming the SDK exposes a global object

@Injectable({
  providedIn: 'root'
})
export class FingerprintService {
  private sdkInitialized: boolean = false;

  constructor() {
    if (typeof CBM_E2_SDK !== 'undefined') {
      this.sdkInitialized = true;
      CBM_E2_SDK.initialize();
    } else {
      console.error('CBM_E2_SDK is not defined. Ensure the SDK is properly loaded.');
    }
  }

  startVideoFeed(videoElement: HTMLVideoElement): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.sdkInitialized) {
        reject('Fingerprint SDK not initialized.');
        return;
      }
      CBM_E2_SDK.startVideoFeed(videoElement)
        .then(() => resolve())
        .catch((error: any) => reject(error));
    });
  }

  captureFingerprint(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.sdkInitialized) {
        reject('Fingerprint SDK not initialized.');
        return;
      }
      CBM_E2_SDK.captureFingerprint()
        .then((data: string) => resolve(data))
        .catch((error: any) => reject(error));
    });
  }

  stopVideoFeed(videoElement: HTMLVideoElement): void {
    if (this.sdkInitialized) {
      CBM_E2_SDK.stopVideoFeed(videoElement);
    } else {
      console.warn('Fingerprint SDK not initialized. Video feed cannot be stopped.');
    }
  }
}
