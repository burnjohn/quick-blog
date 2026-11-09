import React from 'react'

function DescriptionEditor({ editorRef, isGenerating, isCreating, title, onGenerate }) {
  return (
    <div>
      <p className='mb-2 font-mono text-xs uppercase tracking-[0.14em] text-muted'>
        Blog Description <span className='text-lime'>*</span>
      </p>
      <div className='relative h-74 max-w-lg pb-16 pt-2 sm:pb-10'>
        <div ref={editorRef}></div>
        {isGenerating && (
          <div className='absolute inset-0 mt-2 flex items-center justify-center rounded-xl bg-void/60'>
            <div className='h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-lime'></div>
          </div>
        )}
        <button
          disabled={isGenerating || !title || isCreating}
          type='button'
          onClick={onGenerate}
          className='absolute bottom-1 right-2 cursor-pointer rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs text-ink transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isGenerating ? 'Generating...' : 'Generate with AI'}
        </button>
      </div>
    </div>
  )
}

export default DescriptionEditor
