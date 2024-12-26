import type {Archiver} from 'archiver';

declare interface ZipToOptions {
  dir: string;
  name: string;
  out?: string;
  date?: string | boolean;
  debug: boolean;
	gitInfo: boolean;
}

declare type NameFunc = (options: ZipToOptions, config: ZipToDefineConfig) => string;
declare type DateFunc = (options: ZipToOptions, config: ZipToDefineConfig) => string;
declare type OutputFunc = (options: ZipToOptions, other: {zip: string; archive: Archiver;}, config: ZipToDefineConfig) => void;
declare type GitInfoFunc = Promise<(options: ZipToOptions, config: ZipToDefineConfig) => void>;

declare interface ZipToDefineConfig {
  dateformat: string;
  join: string;
  name: NameFunc;
  date?: DateFunc | false;
  output: OutputFunc;
	gitInfo?: GitInfoFunc;
}
