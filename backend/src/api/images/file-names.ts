export function generateNames(fileName: string): { icon: string; banner: string } {
  const lastIndex = fileName.lastIndexOf('.');
  const before = fileName.slice(0, lastIndex);
  const after = fileName.slice(lastIndex);

  return {
    icon: `${before}-Icon${after}`,
    banner: `${before}-Banner${after}`,
  };
}

export function isDerivedImageFile(fileName: string): boolean {
  return fileName.includes('-Icon.') || fileName.includes('-Banner.');
}

export function isVisibleImageFile(fileName: string): boolean {
  return fileName !== '.DS_Store' && !isDerivedImageFile(fileName);
}
