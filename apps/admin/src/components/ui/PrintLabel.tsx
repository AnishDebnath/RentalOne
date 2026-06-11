const PrintLabel = ({ product }: any) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=400,height=400');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Label - ${product.unique_code}</title>
          <style>
            @page { margin: 0; }
            body { 
              font-family: monospace; 
              text-align: center; 
              margin: 0;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .code { 
              font-size: 24px; 
              font-weight: bold; 
              margin-bottom: 10px; 
            }
            img { 
              width: 150px; 
              height: 150px; 
            }
          </style>
        </head>
        <body>
          <div class="code">${product.unique_code}</div>
          <img src="${product.qr_base64}" />
          <script>
            window.onload = () => { 
              window.print(); 
              setTimeout(() => window.close(), 100);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="card-surface space-y-4 p-6 text-center md:p-8">
      <p className="text-sm font-medium text-muted">Print-ready label</p>
      <h2 className="text-2xl font-bold text-ink">{product.name}</h2>
      <p className="font-mono text-3xl font-bold text-primary">{product.unique_code}</p>
      <img
        src={product.qr_base64}
        alt={product.name}
        className="mx-auto h-48 w-48 rounded-card border border-line bg-white p-1 shadow-sm"
      />
      <button type="button" onClick={handlePrint} className="primary-button w-full md:w-80">
        Print Label
      </button>
    </div>
  );
};

export default PrintLabel;
