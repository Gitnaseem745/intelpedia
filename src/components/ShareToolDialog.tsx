"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Check, Share2, Twitter, Facebook, Linkedin } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ShareToolDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tool: {
    title: string
    description: string
  }
}

export function ShareToolDialog({ open, onOpenChange, tool }: ShareToolDialogProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const d = tool.description;
  
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `Check out ${tool.title} - ${d.length > 155 ? `${d.slice(0, 155)}...` : d}`
  const fullShareText = `${shareText} ${currentUrl}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "Tool link has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link. Please try again.",
        variant: "destructive"
      })
    }
  }

  const shareOnSocialMedia = (platform: string) => {
    let url = ''
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
        break
      default:
        return
    }
    
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Tool
          </DialogTitle>
          <DialogDescription>
            Share this tool with others by copying the link or using social media platforms.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* URL Input with Copy Button */}
          <div className="space-y-2">
            <Label htmlFor="tool-url">Tool URL</Label>
            <div className="flex gap-2">
              <Input
                id="tool-url"
                value={currentUrl}
                readOnly
                className="flex-1"
              />
              <Button
                type="button"
                size="sm"
                className="px-3"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Social Media Share Buttons */}
          <div className="space-y-2">
            <Label>Share on social media</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
                onClick={() => shareOnSocialMedia('twitter')}
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
                onClick={() => shareOnSocialMedia('facebook')}
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
                onClick={() => shareOnSocialMedia('linkedin')}
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </Button>
            </div>
          </div>

          {/* Copy Full Text Button */}
          <div className="space-y-2">
            <Label>Share text with link</Label>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(fullShareText)
                  toast({
                    title: "Text copied!",
                    description: "Share text with link has been copied to your clipboard.",
                  })
                } catch (err) {
                  toast({
                    title: "Failed to copy",
                    description: "Could not copy the text. Please try again.",
                    variant: "destructive"
                  })
                }
              }}
            >
              <Copy className="w-4 h-4" />
              Copy text with link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
