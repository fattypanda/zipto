import type {Archiver} from 'archiver';

declare interface ZipToOptions {
  dir: string;
  name: string;
  out?: string;
  date?: string | boolean;
  debug: boolean;
}

declare interface ZipToDefineConfig {
  dateformat: string;
  name (options: ZipToOptions, config: ZipToDefineConfig): string;
  output (options: ZipToOptions, other: {zip: string; archive: Archiver;}, config: ZipToDefineConfig): void;
}
