import type { FilePathInfo } from "../../main/fs/path.ts";

//const emptyFilePathInfo = () => ({
//  fullpath: "",
//  directory: "",
//  file: "",
//  root: "",
//  extension: "",
//});

class File {
  // The currently opened filename as a full path, including the directory prefix.
  info: FilePathInfo | undefined = $state();
  // Has the current file been edited and not yet saved?
  modified: boolean = $state(false);
}

export default new File();
