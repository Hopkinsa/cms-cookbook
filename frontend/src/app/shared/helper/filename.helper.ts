export function generateFilename(name: string): { icon: string; banner: string } {
  const lastIndex = name.lastIndexOf('.');
  const before = name.slice(0, lastIndex);
  const after = name.slice(lastIndex); // if (lastIndex + 1) it would not include the period
  const nameIcon = `${before}-Icon${after}`;
  const nameBanner = `${before}-Banner${after}`;
  return { icon: nameIcon, banner: nameBanner };
}
