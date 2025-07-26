'use client';

import { useTool } from '@/hooks/useTools';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Calendar, Tag as TagIcon, Globe, Wrench, Share } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Feature } from '@/models/Tool';
import RecommendedTools from '@/components/RecommendedTools';
import EmbedBadgeGenerator from '@/components/EmbedBadgeGenerator';
import { ShareToolDialog } from '@/components/ShareToolDialog';
// Removed old embed system import

export default function ToolDetailsClient() {
    const params = useParams();
    const router = useRouter();
    const toolId = params.toolId as string;

    const { data: toolData, isLoading, error } = useTool(toolId);
    const tool = toolData?.tool;

    const [isVisiting, setIsVisiting] = useState(false);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);

    const handleVisitSite = () => {
        if (tool?.siteUrl) {
            setIsVisiting(true);
            window.open(tool.siteUrl, '_blank', 'noopener,noreferrer');
            // Reset the visiting state after a short delay
            setTimeout(() => setIsVisiting(false), 2000);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-5">
                <div className="mt-20 mb-12">
                    <div className="animate-pulse">
                        <div className="h-8 bg-muted rounded mb-4 w-1/4"></div>
                        <div className="h-12 bg-muted rounded mb-6 w-3/4"></div>
                        <div className="h-6 bg-muted rounded mb-4 w-full"></div>
                        <div className="h-6 bg-muted rounded mb-4 w-5/6"></div>
                        <div className="h-6 bg-muted rounded mb-8 w-4/6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <div className="h-64 bg-muted rounded"></div>
                            </div>
                            <div>
                                <div className="h-48 bg-muted rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-5">
                <div className="mt-20 mb-12 text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
                    <p className="text-muted-foreground mb-6">
                        The tool you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <Button onClick={() => router.push('/tools')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Tools
                    </Button>
                </div>
            </div>
        );
    }

    if (!tool) {
        return null;
    }

    return (
        <div className="container mx-auto px-5">
            {/* Breadcrumb Navigation */}
            <div className="mt-8 mb-6">
                <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link href="/tools" className="hover:text-primary">
                        Tools
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">{tool.title}</span>
                </nav>
            </div>

            {/* Back Button */}
            <div className="mb-8">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="flex items-center text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Tools
                </Button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Tool Header */}
                    <div className="mb-8">
                        {/* Featured Image */}
                        {tool.imgUrl && (
                            <div className="mb-8">
                                <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/15 shadow-lg">
                                    <Image
                                        src={tool.imgUrl}
                                        alt={`${tool.title} featured image`}
                                        width={1200}
                                        height={600}
                                        className="w-full h-auto object-contain"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 75vw"
                                        priority
                                        onError={(e) => {
                                            // Fallback to gradient background with icon
                                            const target = e.target as HTMLImageElement;
                                            const container = target.parentElement;
                                            if (container) {
                                                container.innerHTML = `
                          <div class="w-full h-72 bg-gradient-to-br from-primary/10 to-primary/25 flex items-center justify-center">
                            <svg class="w-20 h-20 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1M10 3h4a8 8 0 018 8v2a8 8 0 01-8 8h-4a8 8 0 01-8-8V11a8 8 0 018-8z"></path>
                            </svg>
                          </div>
                        `;
                                            }
                                        }}
                                    />
                                    {/* Overlay gradient for better contrast */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                                </div>
                            </div>
                        )}

                        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">
                            {tool.title}
                        </h1>

                        <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                            {tool.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {tool.tags?.map((tag: string, index: number) => (
                                <Link key={index} href={`/tools/tag/${encodeURIComponent(tag)}`}>
                                    <Badge
                                        variant="secondary"
                                        className="hover:bg-secondary/80 cursor-pointer transition-colors"
                                    >
                                        <TagIcon className="w-3 h-3 mr-1" />
                                        {tag}
                                    </Badge>
                                </Link>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Button
                                onClick={handleVisitSite}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 text-lg"
                                disabled={isVisiting}
                            >
                                {isVisiting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                                        Opening...
                                    </>
                                ) : (
                                    <>
                                        <ExternalLink className="w-5 h-5 mr-2" />
                                        Visit Website
                                    </>
                                )}
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => setShareDialogOpen(true)}
                                className="px-6 py-3"
                            >
                                <Share className="w-5 h-5 mr-2" />
                                Share Tool
                            </Button>
                        </div>
                    </div>

                    {/* Features Section */}
                    {tool.features && tool.features.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-foreground">
                                Features
                            </h2>
                            <div className="space-y-4">
                                {tool.features.map((feature: Feature, index: number) => (
                                    <div key={index} className="bg-muted/50 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold mb-2 text-foreground">
                                            {feature.name}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {feature.details}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Additional Info */}
                    <div className="bg-card rounded-lg border border-border p-6">
                        <h2 className="text-2xl font-bold mb-4 text-foreground">
                            About This Tool
                        </h2>
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-muted-foreground leading-relaxed">
                                {tool.description}
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                This tool has been carefully curated and added to our collection to help you
                                discover the best AI and productivity tools available. Each tool in our database
                                is evaluated for its usefulness, reliability, and innovation.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 space-y-6">
                        {/* Tool Info Card */}
                        <div className="bg-card rounded-lg border border-border p-6">
                            <h3 className="text-lg font-semibold mb-4 text-foreground">
                                Tool Information
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center text-sm">
                                    <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">Added:</span>
                                    <span className="ml-2 font-medium text-foreground">
                                        {formatDate(new Date(tool.createdAt), 'MMM dd, yyyy')}
                                    </span>
                                </div>

                                <div className="flex items-center text-sm">
                                    <Globe className="w-4 h-4 mr-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">Website:</span>
                                    <a
                                        href={tool.siteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-2 text-primary hover:underline font-medium truncate"
                                    >
                                        {new URL(tool.siteUrl).hostname}
                                    </a>
                                </div>

                                <div className="flex items-start text-sm">
                                    <TagIcon className="w-4 h-4 mr-3 text-muted-foreground mt-0.5" />
                                    <span className="text-muted-foreground">Categories:</span>
                                    <div className="ml-2 flex flex-wrap gap-1">
                                        {tool.tags?.slice(0, 3).map((tag: string, index: number) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Card */}
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20 p-6">
                            <h3 className="text-lg font-semibold mb-4 text-foreground">
                                Try This Tool
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Ready to explore what {tool.title} can do for you? Visit their website to get started.
                            </p>
                            <Button
                                onClick={handleVisitSite}
                                className="w-full bg-primary hover:bg-primary/90"
                                disabled={isVisiting}
                            >
                                {isVisiting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                                        Opening...
                                    </>
                                ) : (
                                    <>
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Visit {tool.title}
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Share Card */}
                        <div className="bg-card rounded-lg border border-border p-6">
                            <h3 className="text-lg font-semibold mb-4 text-foreground">
                                Share This Tool
                            </h3>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => {
                                        const url = window.location.href;
                                        const text = `Check out ${tool.title} - ${tool.description.length > 155 ? `${tool.description.slice(0, 155)}...` : tool.description}`;
                                        navigator.clipboard.writeText(`${text} ${url}`);
                                    }}
                                >
                                    Copy Link
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => {
                                        const url = window.location.href;
                                        const text = `Check out ${tool.title} - ${tool.description.length > 155 ? `${tool.description.slice(0, 155)}...` : tool.description}`;
                                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                                    }}
                                >
                                    Share on Twitter
                                </Button>
                            </div>
                        </div>

                        {/* Embed Tool */}
                        <EmbedBadgeGenerator tool={tool} />

                    </div>
                </div>
            </div>

            {/* Related Tools Section */}
            <RecommendedTools
                currentToolId={toolId}
                currentToolTags={tool.tags || []}
            />

            {/* Share Tool Dialog */}
            <ShareToolDialog
                open={shareDialogOpen}
                onOpenChange={setShareDialogOpen}
                tool={{
                    title: tool.title,
                    description: tool.description
                }}
            />

        </div>
    );
}
