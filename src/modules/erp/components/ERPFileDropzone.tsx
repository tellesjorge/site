import React, { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { UploadCloud, FileText, CheckCircle, AlertCircle, Trash2 } from 'lucide-react'

interface ERPFileDropzoneProps {
  onFileParsed: (file: File, type: 'pdf' | 'spreadsheet', arrayBuffer: ArrayBuffer) => void
}

interface LoadedFileInfo {
  name: string
  size: string
  type: 'pdf' | 'spreadsheet'
  status: 'loading' | 'success' | 'error'
  errorMsg?: string
}

export default function ERPFileDropzone({ onFileParsed }: ERPFileDropzoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const [fileList, setFileList] = useState<LoadedFileInfo[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileType = (fileName: string): 'pdf' | 'spreadsheet' | null => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') return 'pdf'
    if (['xlsx', 'xls', 'csv'].includes(ext || '')) return 'spreadsheet'
    return null
  }

  const processFile = (file: File) => {
    const type = getFileType(file.name)
    const fileInfo: LoadedFileInfo = {
      name: file.name,
      size: formatBytes(file.size),
      type: type || 'pdf',
      status: 'loading'
    }

    if (!type) {
      setFileList(prev => [
        ...prev,
        { ...fileInfo, status: 'error', errorMsg: 'Formato não suportado. Use PDF, Excel ou CSV.' }
      ])
      return
    }

    setFileList(prev => [...prev, fileInfo])

    const reader = new FileReader()
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer
      if (buffer) {
        onFileParsed(file, type, buffer)
        setFileList(prev =>
          prev.map(f => (f.name === file.name ? { ...f, status: 'success' } : f))
        )
      } else {
        setFileList(prev =>
          prev.map(f => (f.name === file.name ? { ...f, status: 'error', errorMsg: 'Erro ao ler arquivo.' } : f))
        )
      }
    }
    reader.onerror = () => {
      setFileList(prev =>
        prev.map(f => (f.name === file.name ? { ...f, status: 'error', errorMsg: 'Erro na leitura do arquivo.' } : f))
      )
    }

    reader.readAsArrayBuffer(file)
  }

  const handleDrag = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      Array.from(e.dataTransfer.files).forEach(processFile)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      Array.from(e.target.files).forEach(processFile)
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  const removeFile = (index: number) => {
    setFileList(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-all ${
          dragActive
            ? 'border-[#0071e3] bg-blue-50/50'
            : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white/95'
        } shadow-[0_8px_32px_rgba(15,23,42,0.02)] backdrop-blur-xl`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept=".pdf,.xlsx,.xls,.csv"
          onChange={handleChange}
        />

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0071e3]">
          <UploadCloud className="h-6 w-6" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-800">
          Arraste e solte seus demonstrativos e relatórios
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          Formatos aceitos: PDF, Planilhas Excel (.xlsx, .xls) ou arquivos CSV. Tamanho limite de 10MB por arquivo.
        </p>

        <button
          type="button"
          onClick={onButtonClick}
          className="mt-5 rounded-full bg-[#0071e3] px-5 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-[#2997ff]"
        >
          Procurar arquivos
        </button>
      </div>

      {fileList.length > 0 && (
        <div className="space-y-2 rounded-2xl border border-slate-100 bg-white/60 p-4 shadow-sm">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Arquivos carregados no workspace
          </h4>
          <div className="divide-y divide-slate-100">
            {fileList.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 text-xs first:pt-0 last:pb-0">
                <div className="flex min-w-0 items-center gap-2">
                  <FileText className={`h-4.5 w-4.5 flex-shrink-0 ${file.type === 'pdf' ? 'text-red-500' : 'text-emerald-500'}`} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">{file.name}</p>
                    <p className="text-[10px] text-slate-400">{file.size}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {file.status === 'loading' && (
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      <span className="h-2 w-2 animate-ping rounded-full bg-blue-500" /> Processando...
                    </span>
                  )}
                  {file.status === 'success' && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                      <CheckCircle className="h-3.5 w-3.5" /> Mapeado
                    </span>
                  )}
                  {file.status === 'error' && (
                    <span className="flex items-center gap-1 text-[10px] text-red-500 font-semibold" title={file.errorMsg}>
                      <AlertCircle className="h-3.5 w-3.5" /> Falhou
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
