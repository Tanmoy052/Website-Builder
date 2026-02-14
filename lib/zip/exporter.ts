import JSZip from 'jszip';

export async function createProjectZip(files: { path: string; content: string }[]) {
  const zip = new JSZip();

  files.forEach(file => {
    zip.file(file.path, file.content);
  });

  return await zip.generateAsync({ type: 'blob' });
}
