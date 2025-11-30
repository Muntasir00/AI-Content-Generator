import { useState, useEffect } from 'react';
import { useContentStore } from '~/store/contentStore';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';

export default function DashboardView() {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState('Blog Outline');

  const {
    jobId,
    status,
    generatedContent,
    generate,
    checkStatus,
    loading,
    error,
    items,
    listLoading,
    fetchList,
    fetchItem,
    selectedItem,
    removeItem,
    clearSelected,
  } = useContentStore();

  // Poll status every 3s while there's an incomplete job
  useEffect(() => {
    let interval: number | undefined;
    if (jobId && status !== 'completed') {
      interval = window.setInterval(() => {
        checkStatus();
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [jobId, status, checkStatus]);

  // load list on mount
  useEffect(() => {
    fetchList().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='min-h-screen mt-10 p-8 max-w-5xl mx-auto'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Left: generator */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Content with AI</CardTitle>
          </CardHeader>

          <CardContent className='space-y-6'>
            <div className='flex flex-col gap-3'>
              <Label htmlFor='prompt'>Prompt</Label>
              <Input
                id='prompt'
                placeholder='Enter your prompt...'
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-3'>
              <Label htmlFor='type'>Content Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id='type' className='w-full'>
                  <SelectValue placeholder='Select a type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Blog Outline'>Blog Outline</SelectItem>
                  <SelectItem value='Social Media Caption'>
                    Social Media Caption
                  </SelectItem>
                  <SelectItem value='Product Description'>
                    Product Description
                  </SelectItem>
                  <SelectItem value='Product Description'>
                    LinkedIn Post
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => generate(prompt, type)}
              disabled={loading || !prompt.trim()}
              className='w-full'
            >
              {loading ? 'Sending...' : 'Generate'}
            </Button>

            {error && <p className='text-sm text-destructive'>{error}</p>}

            {jobId && (
              <p>
                Job ID: <span className='font-mono'>{jobId}</span>
              </p>
            )}
            {status && (
              <p>
                Status: <span className='font-medium'>{status}</span>
              </p>
            )}

            {generatedContent && (
              <ScrollArea className='h-160 mt-4 p-4 border rounded-md bg-muted'>
                <pre className='whitespace-pre-wrap text-sm'>
                  {generatedContent}
                </pre>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Right: list / details */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Content</CardTitle>
          </CardHeader>

          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-muted-foreground'>
                {listLoading ? 'Loading...' : `${items.length} results`}
              </div>
              <div>
                <Button onClick={() => fetchList()} size='sm' className='ml-2'>
                  Refresh
                </Button>
              </div>
            </div>

            <div className='grid gap-2'>
              {items.length === 0 && !listLoading && (
                <div className='text-sm text-muted-foreground'>
                  No content yet.
                </div>
              )}

              {items.map(item => (
                <div
                  key={item._id}
                  className='p-3 border rounded-md flex justify-between items-start gap-3'
                >
                  <div
                    className='flex-1 cursor-pointer'
                    onClick={() => fetchItem(item._id)}
                  >
                    <div className='font-medium'>{item.type}</div>
                    <div className='text-xs text-muted-foreground truncate'>
                      {item.prompt}
                    </div>
                    <div className='text-xs mt-1'>
                      <span className='font-mono'>{item.jobId}</span> •{' '}
                      <span className='text-sm'>{item.status}</span>
                    </div>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => fetchItem(item._id)}
                    >
                      View
                    </Button>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => {
                        if (confirm('Delete this content?'))
                          removeItem(item._id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* selected item details */}
            {selectedItem && (
              <div className='mt-2 border p-3 rounded-md bg-background'>
                <div className='flex items-start justify-between'>
                  <div>
                    <div className='text-sm font-semibold'>
                      {selectedItem.type}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {selectedItem.prompt}
                    </div>
                    <div className='text-xs mt-1'>
                      Status: {selectedItem.status}
                    </div>
                  </div>

                  <div>
                    <Button size='sm' onClick={() => clearSelected()}>
                      Close
                    </Button>
                  </div>
                </div>

                <div className='mt-3'>
                  <ScrollArea className='h-64 mt-4 p-4 border rounded-md bg-muted'>
                    <pre className='whitespace-pre-wrap text-sm'>
                      {selectedItem.generatedContent ??
                        'No generated content available.'}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
