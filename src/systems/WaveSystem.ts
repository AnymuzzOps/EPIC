export class WaveSystem {
  elapsed = 0;

  update(deltaSeconds: number): void {
    this.elapsed += deltaSeconds;
  }
}
