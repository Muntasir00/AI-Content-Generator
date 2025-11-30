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
  } = useContentStore();

  useEffect(() => {
    if (!jobId || status === 'completed') return;

    const interval = setInterval(() => {
      checkStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId, status]);

  return (
    <div className='min-h-screen mt-10 p-8 max-w-3xl mx-auto'>
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
                <SelectItem value='SEO Description'>
                  Social Media Caption
                </SelectItem>
                <SelectItem value='SEO Description'>
                  Product Description
                </SelectItem>

                <SelectItem value='LinkedIn Post'>LinkedIn Post</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => generate(prompt, type)}
            disabled={loading}
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
            <ScrollArea className='max-h-64 mt-4 p-4 border rounded-md bg-muted'>
              <pre className='whitespace-pre-wrap text-sm'>
                {generatedContent}
              </pre>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
