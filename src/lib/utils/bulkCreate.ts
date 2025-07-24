import fs from 'fs';
import path from 'path';
import connectDB from '@/lib/db';
import Tool from '@/models/Tool';

interface AITool {
  index: number;
  meta: {
    name: string;
    description: string;
    tag: string;
    thumbnail: string;
    pageUrl: string;
    visitUrl: string;
  };
  main: {
    title: string;
    subheading: string;
    description: string;
    location: string;
    tags: string[];
    features?: Array<{
      name: string;
      details: string;
    }>;
  };
}

export async function bulkCreateTools() {
  try {
    await connectDB();
    
    const toolsPath = path.join(process.cwd(), 'data', 'ai-tools-data.json');
    
    if (!fs.existsSync(toolsPath)) {
      console.log(`Tools data file not found at: ${toolsPath}`);
      return { success: false, message: 'Tools data file not found' };
    }

    const toolsData: AITool[] = JSON.parse(fs.readFileSync(toolsPath, 'utf-8'));
    console.log(`Total tools to add: ${toolsData.length}`);

    let addedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const toolData of toolsData) {
      try {
        const { title, description, tags, features } = toolData.main;
        const { visitUrl } = toolData.meta;

        // Check if tool already exists
        const existingTool = await Tool.findOne({ title });
        if (existingTool) {
          console.log(`Tool "${title}" already exists, skipping...`);
          skippedCount++;
          continue;
        }

        await Tool.create({
          title,
          description,
          tags: tags || [],
          siteUrl: visitUrl,
          features: features || []
        });

        console.log(`Added tool: ${title}`);
        addedCount++;
      } catch (error) {
        console.error(`Error adding tool "${toolData.main.title}":`, error);
        errorCount++;
      }
    }

    const message = `Bulk create completed. Added: ${addedCount}, Skipped: ${skippedCount}, Errors: ${errorCount}`;
    console.log(message);
    
    return {
      success: true,
      message,
      stats: { addedCount, skippedCount, errorCount }
    };
  } catch (error) {
    console.error('Bulk create error:', error);
    return {
      success: false,
      message: 'Failed to bulk create tools',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
