import { useEffect, useRef, useCallback } from 'react'
import QuillEditor from 'quill'

export function useQuillEditor(options = {}, onChange = null) {
  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const isInitialized = useRef(false)
  const optionsRef = useRef(options)
  const onChangeRef = useRef(onChange)

  // Update onChange ref when it changes
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (!isInitialized.current && editorRef.current && !quillRef.current) {
      quillRef.current = new QuillEditor(editorRef.current, {
        theme: 'snow',
        ...optionsRef.current
      })
      isInitialized.current = true

      // Set up change listener if onChange callback provided
      if (onChangeRef.current) {
        const handler = () => {
          const html = quillRef.current.root.innerHTML
          onChangeRef.current(html)
        }
        
        quillRef.current.on('text-change', handler)
      }
    }

    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change')
      }
    }
  }, [])

  const setContent = useCallback((html) => {
    if (quillRef.current) {
      quillRef.current.root.innerHTML = html
    }
  }, [])

  return {
    editorRef,
    quillRef,
    setContent
  }
}

