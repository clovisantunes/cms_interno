
interface PdfViewerProps {
  fileUrl: string;
}

export const PdfViewer = ({ fileUrl }: PdfViewerProps) => {
  return (
    <div style={{  top: 0, left: 0, width: '100%', height: '100%' }}>
      <iframe
        src={fileUrl}
        title="Visualizador de PDF"
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
        }}
      />
    </div>
  );
};
