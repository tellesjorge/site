import * as pdfjs from 'pdfjs-dist'

// Try setting worker from CDN matching version or fallback
try {
  const version = pdfjs.version || '3.11.174'
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`
} catch (e) {
  console.warn('Failed to set PDF worker src', e)
}

export async function parsePdfText(arrayBuffer: ArrayBuffer): Promise<{ text: string; pageCount: number }> {
  try {
    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) })
    const pdf = await loadingTask.promise
    const pageCount = pdf.numPages
    let extractedText = ''

    // Read first 5 pages to keep performance high and avoid huge dumps
    const pagesToRead = Math.min(pageCount, 5)
    for (let i = 1; i <= pagesToRead; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      extractedText += `--- Página ${i} ---\n${pageText}\n\n`
    }

    if (pageCount > 5) {
      extractedText += `\n[Exibindo primeiras 5 de ${pageCount} páginas para otimização de performance.]`
    }

    return { text: extractedText.trim(), pageCount }
  } catch (error) {
    console.error('Error parsing PDF', error)
    throw new Error('Falha ao processar o PDF. Certifique-se de que ele contém texto extraível.')
  }
}
